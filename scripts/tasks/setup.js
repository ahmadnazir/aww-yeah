#!/usr/bin/node
// -*- mode: js -*-

var config   = require('../lib/config').get();
var services = require('../lib/services');
var mkdirp   = require('mkdirp');

mkdirp(config.dir);

// Clone repos
var servicesData = services.getDefined();
for (var id in servicesData) {
    services.displayInfo(id, true);
    services.clone(config.dir, servicesData[id].name, servicesData[id].url);
    services.bootstrap(servicesData[id].path);
}