var services = require('./../lib/services');
var args = require('optimist')
    .usage('Manage a service')
    .argv;

var command = args._[0] || 'up';
var serviceIds = args._[1] || '';

function execute(id) {
    services.validate(id);
    services.displayInfo(id, true);
    services.exec(id, command);
}

if (serviceIds === 'all') {
    for (var id in services.getDefined()) {
        execute(id)
    }
} else {
    serviceIds.split(',').forEach((serviceId, index) => {
        execute(serviceId);
    });
}

