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
//const adapter = new utils.Adapter('countdown');
let adapter;

startAdapter();

process.on('uncaughtException', function (err) {
    if (adapter && adapter.log) {
        adapter.log.warn('Exception: ' + err);
    }
    onClose();
});

function onClose(callback) {

    if (callback) {
        callback();
    }
}


function startAdapter(options) {
    options = options || {};
    options = {...options, ...{name: `countdown`}};

    adapter = new utils.Adapter(options);
    adapter.log.info('start adapter');

};

function stop() {
    adapter.log.info('stop adapter');
}


function main() {
    adapter.log.info('No one IP configured');


    adapter.config.interval = parseInt(adapter.config.interval, 10);

// polling min 5 sec.
    if (adapter.config.interval < 5000) {
        adapter.config.interval = 5000;
    }

    adapter.subscribeStates('*');
}