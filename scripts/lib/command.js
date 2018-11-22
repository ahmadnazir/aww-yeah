var childProcess = require('child_process');
var colors       = require('colors');
var shelljs      = require('shelljs');

function runRaw(cmd, path) {
    if (path) {
        cmd = 'cd ' + path + ' && ' + cmd;
    }
    console.log(colors.gray(cmd));
    var exec = shelljs.execSync(cmd, {silent: true});
    console.log(colors.gray(exec.stdout || exec.stderr));
}

function run(cmd, path) {
    console.log(cmd.gray);
    console.log();
    var parts = cmd.split(' ');
    var command = parts.shift();
    var args = parts;
    var p = childProcess.spawn(command, args, {
        cwd: path,
        stdio: 'inherit'
        // detached: true
    });
}


module.exports = {
    run: run,
    runRaw: runRaw
};
