var definitions = require('./../../service-definitions');
var services    = require('./../lib/services');
var command     = require('./../lib/command');
var colors      = require('colors');
var optimist    = require('optimist');

var args    = optimist
    .usage(
        'Run a command inside the conainer: \n'.grey +
            'Usage:   '.grey +
            ' $0 SERVICE[,SERVICE] COMMAND \n'.blue +
            'Example: '.grey +
            ' $0 sign scripts/phpcs.sh'.blue
          )
    .demand(2)
    .argv;

var serviceIds = args._[0] || [];
args._.shift();
var c = args._.join(' ');

// Run the command for all the services
//
serviceIds.split(',').forEach((serviceId, index) => {
    services.validate(serviceId);
    let service = services.get(serviceId);
    if (c.indexOf("'") > -1) {
        console.log('Single quotes not allowed in the command:'.red);
        return;
    }
    c = definitions.COMMAND.exec.replace('{{COMMAND}}', c);
    command.run(c, service.path);
});
