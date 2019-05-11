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
startAdapter()

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
    countdownenabled()

    adapter.config.interval = 60000;
    adapter.subscribeStates('*')
}


function countdownenabled(){
    // Check if there are active countdowns
    if (adapter.config.setup) {
        const setup = adapter.config.setup;
        adapter.log.info('setup found');
        adapter.log.info(setup); 
        for (const active of setup){
            adapter.log.info(setup);
            adapter.log.info(active);
            adapter.log.info(setup.active);
            adapter.log.info(active.active);

        }
    }
    else{
        adapter.log.info('No countdown setup found!'); 
    }
} 

/*
// If started as allInOne/compact mode => return function to create instance
if (module && module.parent) {
    module.exports = startAdapter;
} else {
    // or start the instance directly
} 
*/