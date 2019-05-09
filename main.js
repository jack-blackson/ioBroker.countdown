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
let adapter;

startAdapter();

process.on('uncaughtException', function (err) {
    if (adapter && adapter.log) {
        adapter.log.warn('Exception: ' + err);
    }
});


function startAdapter(options) {
    options = options || {};
    options = {...options, ...{name: `countdown`}};

    adapter = new utils.Adapter(options);
    //adapter.log.info('start adapter');
    return adapter;
};

function stop() {
    adapter.log.info('stop adapter');
}


function main() {
    adapter.log.info('No one IP configured');
    adapter.config.interval = parseInt(adapter.config.interval, 10);
    adapter.subscribeStates('*');
}