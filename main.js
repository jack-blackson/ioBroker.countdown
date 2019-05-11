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
    adapter.log.info('Alarm Active:');
    adapter.log.info(countdownenabled());

    adapter.config.interval = 60000;
    adapter.subscribeStates('*')
}


function countdownenabled(){
    var alarmactive = false;
    // Check if there are active countdowns
    if (adapter.config.setup) {
        const setup = adapter.config.setup;
        adapter.log.info('setup found');
        for (const item of setup){
            if (item.active == true){
                alarmactive = true;
            }
        }
    }
    else{
        adapter.log.info('No countdown setup found!'); 
    }
    return alarmactive

} 

/*
// If started as allInOne/compact mode => return function to create instance
if (module && module.parent) {
    module.exports = startAdapter;
} else {
    // or start the instance directly
} 
*/