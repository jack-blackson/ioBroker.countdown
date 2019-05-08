/**
 *
 *      ioBroker COUNTDOWN Adapter
 *
 *      (c) 2019 Alexander K <blacksonj7@gmail.com>
 *
 *      MIT License
 *
 */

'use strict';
const utils = require('@iobroker/adapter-core');
const adapter = new utils.Adapter('countdown');


function startAdapter(options) {
    adapter.log.info('start adapter');

};

function stop() {
    adapter.log.info('stop adapter');
}

// Load your modules here, e.g.:
// const fs = require("fs");

function main() {
    //host = adapter.host;
    adapter.log.info('No one IP configured');

    //adapter.log.debug('Host = ' + host);

    if (!adapter.config.countdown.length) {
        adapter.log.info('No one IP configured');
        stop();
        return;
    }

    adapter.config.interval = parseInt(adapter.config.interval, 10);

// polling min 5 sec.
    if (adapter.config.interval < 5000) {
        adapter.config.interval = 5000;
    }

    adapter.subscribeStates('*');
}