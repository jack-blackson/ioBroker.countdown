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

function startAdapter(options) {
    options = options || {};
    Object.assign(options, {
        name: 'countdown',
        ready: () => main()
    });

    adapter = new utils.Adapter(options);
    return adapter;
}


function main() {
    adapter.log.info('Main!');

    countdownenabled()

    adapter.config.interval = 500;
    adapter.subscribeStates('*')
}

function countdownenabled(){
    adapter.log.info('countdownenabled!');

} 





// If started as allInOne/compact mode => return function to create instance
if (module && module.parent) {
    module.exports = startAdapter;
} else {
    // or start the instance directly
    startAdapter();
} 