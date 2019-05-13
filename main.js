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
const moment = require('moment');
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

    adapter.log.info('Alarm Active:' + countdownenabled());
    updatemasterdataobjects()
    if (countdownenabled()) {

    }
    else{
        adapter.log.info('No active countdown');
    }



    adapter.config.interval = 60000;
    adapter.subscribeStates('*')
}

function updatemasterdataobjects(){
    if (adapter.config.setup) {
        const setup = adapter.config.setup;
        for (const item of setup){
            let datestring = "";
            datestring = item.day + "." + item.month + "." + item.year + " " + item.hour + ":" + item.minute;
            adapter.log.info('Datestring' + datestring);

            var newdate = moment(datestring, 'DD.MM.YYYY HH:mm').toDate();

            //DateTimeFormatter formatter = DateTimeFormat.forPattern("dd.MM.yyyy HH:mm");
            //DateTime newdate = formatter.parseDateTime(datestring);
            adapter.log.info('NewDate:' + newdate);

            adapter.setObjectAsync('masterdata.'+item.name, {type: `channel`,common: {name: item.name},native: {}});
            adapter.setObjectAsync('masterdata.'+item.name + '.active', {type: `boolean`,common: {name: item.active},native: {}});
            adapter.setObjectAsync('masterdata.'+item.name + '.name', {type: `string`,common: {name: item.name},native: {}});
            adapter.setObjectAsync('masterdata.'+item.name + '.year', {type: `number`,common: {name: item.year},native: {}});
            adapter.setObjectAsync('masterdata.'+item.name + '.month', {type: `number`,common: {name: item.month},native: {}});
            adapter.setObjectAsync('masterdata.'+item.name + '.day', {type: `number`,common: {name: item.day},native: {}});
            adapter.setObjectAsync('masterdata.'+item.name + '.hour', {type: `number`,common: {name: item.hour},native: {}});
            adapter.setObjectAsync('masterdata.'+item.name + '.minute', {type: `number`,common: {name: item.minute},native: {}});
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