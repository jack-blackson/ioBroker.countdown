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

    adapter.log.info('Alarm Active:',countdownenabled());
    updateobjects()
    if (countdownenabled()) {

    }
    else{
        adapter.log.info('No active countdown');
    }



    adapter.config.interval = 60000;
    adapter.subscribeStates('*')
}

function updateobjects(){
    if (adapter.config.setup) {
        const setup = adapter.config.setup;
        for (const item of setup){
            adapter.setObjectAsync('countdown.masterdata'+item.index, {type: `channel`,common: {name: item.name},native: {}});
            /*
            createState('countdown.masterdata.', '9/4/2016', { name: 'Termin Datum', desc: 'Datum des Termins (als Objekt)', type: 'string' }); 
            createState('Countdown.Termin.Datum.String', '3.12.2016', { name: 'Termin Datum (als String)', desc: 'Datum des Termins als Zeichenkette', type: 'string' }); 
            createState('Countdown.Termin.Name', 'Name des Termins', { name: 'Termin Name', desc: 'Bezeichnung des Termins', type: 'string' }); 
            createState('Countdown.Termin.Rest.Total', { name: 'Millisekunden bis zum Termin', desc: 'Restliche Millisekunden bis zum Datum des Termins', type: 'number', unit: 'ms' }); 
            createState('Countdown.Termin.Rest.Tage', { name: 'Tage bis zum Termin', desc: 'Restliche Tage bis zum Datum des Termins', type: 'number', unit: 'Tage' }); 
            createState('Countdown.Termin.Rest.Wochen', { name: 'Wochen bis zum Termin', desc: 'Restliche Wochen bis zum Datum des Termins', type: 'number', unit: 'Wochen' });  
            */

        }
    }
    else{
        // no countdown available
    }
}


function countdownenabled(){
    var alarmactive = false;
    // Check if there are active countdowns
    if (adapter.config.setup) {
        const setup = adapter.config.setup;
        for (const item of setup){
            if (item.active == true){
                alarmactive = true;
            }
        }
    }
    else{
        // no setup available
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