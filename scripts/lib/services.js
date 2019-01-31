var os           = require('os');
var config       = require('./../lib/config');
var definitions  = require('./../../service-definitions');
var shelljs      = require('shelljs');
var childProcess = require('child_process');
var prettyJson   = require('prettyjson');
var colors       = require('colors');
var prompt       = require('prompt-sync')();
var fs           = require('fs');
var command      = require('./command');
var monitor      = require('./monitor');

var cfg      = config.get();
var username = cfg.github.username;
var ssh      = cfg.github.ssh;

function createDefinition(id) {
    var definition = definitions[id];
    var enabled = !!cfg.services[id];
    var url = // (ssh ? 'git@github.com:' : 'https://github.com/')
        'git@github.com:'
        + (definition.name.indexOf('/') > 0
           ? definition.name
           : username + '/' + definition.name)
        + '.git';
    var path = cfg.dir + '/' + definition.name;

    return Object.assign(definition, {
        id: id,
        url: url,
        path: path,
        enabled: enabled
    });
}

function getDefinition(path) {
    try {
        return require(path);
    } catch (err) {
        console.log("Aww shucks! Unable to load aww yeah service definition at: %s\n".yellow, path);
        console.log("%s\n".red, err);
    }
    process.exit(0);
}

// @todo: change name to getServiceDefinitions
function getDefined(includeDisabled) {
    var all = {};
    for (var id in cfg.services) {
        var value = cfg.services[id];
        var definition = undefined;
        var enabled;
        // console.log(value);

        if (typeof value == 'string') {
            var path = value + '/' + '.yeah.json';
            definition = getDefinition(path);
            enabled    = !!definition.enabled;
        } else {
            enabled = !!value;
        }

        // Filter out disabled services
        if (!includeDisabled && !enabled) {
            continue;
        }
        all[id] = definition ? definition : createDefinition(id);
    }
    return all;
}

function validate(id) {
    let service = getDefined()[id];

    if (!id || !service) {
        error = "Service \"%s\" doesn't exist!";
        error += ' Configured services are: %s\n';
        console.log(error.yellow, id, Object.keys(getDefined()));
        process.exit(0);
    }

      if (!fs.existsSync(service.path)) {
        error = "Service folder \"%s\" doesn't exist!";
        console.log(error.yellow, service.path);
        process.exit(1);
      }

    return service;
}

function get(id) {
    let service = getDefined()[id];
    if (!service) {
        throw new Error("Service doesn't exist" + id);
    }
    return service;
}

function getLogFilesForProfile(service, profile) {
    // Get the profile is requested
    if (!service.logs || !service.logs.profiles) {
        console.log('Profile "%s" is not defined for service "%s"'.red, profile, service.id);
        process.exit(0);
    }
    var files = service.logs.profiles[profile];
    if (!files) {
        console.log('Profiles are not defined for service %s'.red, service.id);
        process.exit(0);
    }
    return files.map(file => {
        return service.path + '/' + file;
    });
}

function getLogFile(service) {
    if (!service.logs) {
        console.log('Not implemented'.red);
        process.exit(0);
    }

    // Build a list of the files that can be monitored
    //
    var all = [];
    service.logs.directories.forEach(dir => {
        var path = service.path + '/' + dir + '/';
        var exec = shelljs.ls(path).forEach(file => {
            if (!file.endsWith('.log')) {
                return;
            }
            all.push(path + '/' + file);
        });
    });

    // Print all options for the log file
    //
    all.forEach((file, index) => {
        // console.log(file);
        var parts = file.split('/');
        console.log(" %s : %s ", pad(index + 1).cyan, parts[parts.length-1].gray );
    });

    // Get the file that we want to monitor
    //
    console.log();
    var selection = prompt('Which file do you want to monitor? '.cyan);
    console.log();
    return all[selection - 1];
}

function exec(id, cmd, options) {
    let service = get(id);
    let c;
    let raw = false;
    switch (cmd) {
    case 'up':
        c = service.commands && service.commands.up || definitions.COMMAND.up;
        break;
    case 'image':
        c = service.commands && service.commands.image || definitions.COMMAND.image;
        break;
    case 'start':
        c = service.commands && service.commands.start || definitions.COMMAND.start;
        break;
    case 'recreate':
        c = service.commands && service.commands.recreate || definitions.COMMAND.recreate;
        break;
    case 'kill':
        c = service.commands && service.commands.kill || definitions.COMMAND.kill;
        break;
    case 'stop':
        // @todo: update all relevant commands and make them objects so that we
        // can determine which ones are raw instead of only making the stop
        // commands raw, e.g.:
        //
        // {raw: "command ..."}
        //
        if (service.commands && service.commands.stop) {
            raw = true;
            c  = service.commands.stop;
        } else {
            c = definitions.COMMAND.stop;
        }
        break;
    case 'env':
        c = service.commands && service.commands.env || definitions.COMMAND.env;
        break;
    case 'monitor':
        // @todo: move this to a separate file (lib/monitor.js)
        var files = options.profile
            ? getLogFilesForProfile(service, options.profile)
            : [getLogFile(service)];
        files.forEach(file => {
            monitor.run(service.id, file, options);
        });
        return;
    default:
        console.log('Invalid command specified "%s". Valid commands are up, start, stop, env, monitor, image.'.yellow, command);
        return;
    }

    var cs = (typeof c === 'object' && c.constructor === Array) ? c : [c];

    cs.forEach(function(c) {
        if (typeof c !== 'string') {
            raw = true;
            c = c.raw;
        }
        if (raw) {
            command.runRaw(c, service.path);
        } else {
            command.run(c, service.path);
        }
    });
}

function displayInfo(id, brief) {
    var service = get(id);
    var info = {
        name: service.name
    };
    if (!brief) {
        info = Object.assign(info, service);
    }
    console.log(prettyJson.render(info));
    console.log('');
}

function displayStatus(service, silent) {
    var id = service.id;
    var c = service.commands && service.commands.isRunning || definitions.COMMAND.isRunning;
    c = c.replace('{service-id}', id);
    var exec = shelljs.exec(c, {silent: true});
    if (!silent) {
        console.log(c.gray);
        console.log();
        console.log(colors.gray(exec.stdout));
    }
    console.log('%s :\t %s',
                pad(id), // padded service id
                (exec.code === 0 ? colors.green('\u2713') : colors.red('\u2718'))
               );
}

function clone(base, name, url) {
    let path = base + '/' + name;

    if (fs.existsSync(path)) {
        error = "The repository %s seems to be already cloned!\n";
        console.log(error.yellow, "\"" + name + "\"");
        return;
    }

    console.log("Cloning started...".green);

    let cmd = 'git clone --recursive ' + url + ' ' + path;
    command.runRaw(cmd);
}

function bootstrap(path) {
    console.log("Bootstrapping started...".green);

    command.run(definitions.COMMAND.bootstrap, path);
}

function pad(string) {
    var chars = '          ';
    return (chars + string).slice(-chars.length);
}

function getDocs(service, ignoreMissing) {
    if (!service.port || !service.docs || !service.docs.publicUrl) {
        return null;
    }

    return 'http://dev.penneo.com:' + service.port + service.docs.publicUrl;
}

module.exports = {
    getDefined: getDefined,
    get: get,
    exec: exec,
    validate: validate,
    displayInfo: displayInfo,
    displayStatus: displayStatus,
    getDocs: getDocs,
    clone: clone,
    bootstrap: bootstrap
}
