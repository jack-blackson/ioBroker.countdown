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

setInterval(function() { 
    // alle 1 Minute ausführen 
    main(); 
}, 60000);

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
    cleanresults()
    if (countdownenabled()) {
        updateresults()
    }
    else{
        adapter.log.info('No active countdown');
    }

    adapter.config.interval = 60000;
    adapter.subscribeStates('*')
}

function cleanresults(){
    adapter.delObject(adapter.results.Days, function (err) {
        if (err) {
            adapter.log.error('Cannot delete results' + ' Error: ' + err);
        }
    }
}

function updateresults(){
    const setup = adapter.config.setup;
        for (const item of setup){
            let datestring = "";
            datestring = item.day + "." + item.month + "." + item.year + " " + item.hour + ":" + item.minute;

            var newdate = moment(datestring, 'DD.MM.YYYY HH:mm').toDate();
            var now = moment(new Date()); //todays date
            var duration = moment.duration(now.diff(newdate));
            var years = duration.years() * -1;
            var months = duration.months() * -1;
            var days = duration.days() * -1;
            var hours = duration.hours() * -1;
            var minutes = duration.minutes() * -1;

            if (now.diff(newdate) >= 0){
                // Countdown reached today -> disable countdown
                adapter.setObjectAsync('results.'+item.name + '.reached', {type: `boolean`,common: {name: true},native: {}});
                adapter.setObjectAsync('results.'+item.name + '.year', {type: `number`,common: {name: ''},native: {}});
                adapter.setObjectAsync('results.'+item.name + '.month', {type: `number`,common: {name: ''},native: {}});
                adapter.setObjectAsync('results.'+item.name + '.day', {type: `number`,common: {name: ''},native: {}});
                adapter.setObjectAsync('results.'+item.name + '.hour', {type: `number`,common: {name: ''},native: {}});
                adapter.setObjectAsync('results.'+item.name + '.minute', {type: `number`,common: {name: ''},native: {}});
            }
            else{
                // Countdown not reached -> update values
                adapter.setObjectAsync('results.'+item.name + '.reached', {type: `boolean`,common: {name: false},native: {}});
                adapter.setObjectAsync('results.'+item.name + '.year', {type: `number`,common: {name: years},native: {}});
                adapter.setObjectAsync('results.'+item.name + '.month', {type: `number`,common: {name: months},native: {}});
                adapter.setObjectAsync('results.'+item.name + '.day', {type: `number`,common: {name: days},native: {}});
                adapter.setObjectAsync('results.'+item.name + '.hour', {type: `number`,common: {name: hours},native: {}});
                adapter.setObjectAsync('results.'+item.name + '.minute', {type: `number`,common: {name: minutes},native: {}});

                var CountDowninWordsShort = '';
                if (years != 0){
                    CountDowninWordsShort = years+'Y';
                }
                if (months != 0){
                    CountDowninWordsShort += months+'M';
                }
                if (days != 0){
                    CountDowninWordsShort += days+'D';
                }
                if (hours != 0){
                    CountDowninWordsShort += ' ' + hours+'H';
                }
                CountDowninWordsShort += minutes+'M';
                adapter.setObjectAsync('results.'+item.name + '.inwordsshort', {type: `string`,common: {name: CountDowninWordsShort},native: {}});

                var CountDowninWordsLong = '';
                if (years != 0){
                    if (years > 1){
                        CountDowninWordsLong = years+'Year ';
                    }
                    else{
                        CountDowninWordsLong = years+'Years ';
                    }
                }
                if (months != 0){
                    if (months > 1){
                        CountDowninWordsLong = months+'Months ';
                    }
                    else{
                        CountDowninWordsLong = months+'Month ';
                    }
                }
                if (days != 0){
                    if (days > 1){
                        CountDowninWordsLong = days+'Days ';
                    }
                    else{
                        CountDowninWordsLong = days+'Day ';
                    }
                }
                if (hours != 0){
                    if (hours > 1){
                        CountDowninWordsLong = hours+'Hours ';
                    }
                    else{
                        CountDowninWordsLong = hours+'Hour ';
                    } 
                }
                if (minutes > 1){
                    CountDowninWordsLong = minutes+'Minutes ';
                }
                else{
                    CountDowninWordsLong = minutes+'Minute ';
                } 
                adapter.setObjectAsync('results.'+item.name + '.inwordslong', {type: `string`,common: {name: CountDowninWordsLong},native: {}});
            }
            adapter.setObjectAsync('results.'+item.name, {type: `channel`,common: {name: item.name},native: {}});
            adapter.setObjectAsync('results.'+item.name + '.name', {type: `string`,common: {name: item.name},native: {}});

        }
}

function updatemasterdataobjects(){
    if (adapter.config.setup) {
        const setup = adapter.config.setup;
        for (const item of setup){
            let datestring = "";
            datestring = item.day + "." + item.month + "." + item.year + " " + item.hour + ":" + item.minute;

            var newdate = moment(datestring, 'DD.MM.YYYY HH:mm').toDate();

            adapter.setObjectAsync('masterdata.'+item.name, {type: `channel`,common: {name: item.name},native: {}});
            adapter.setObjectAsync('masterdata.'+item.name + '.active', {type: `boolean`,common: {name: item.active},native: {}});
            adapter.setObjectAsync('masterdata.'+item.name + '.name', {type: `string`,common: {name: item.name},native: {}});
            adapter.setObjectAsync('masterdata.'+item.name + '.year', {type: `number`,common: {name: item.year},native: {}});
            adapter.setObjectAsync('masterdata.'+item.name + '.month', {type: `number`,common: {name: item.month},native: {}});
            adapter.setObjectAsync('masterdata.'+item.name + '.day', {type: `number`,common: {name: item.day},native: {}});
            adapter.setObjectAsync('masterdata.'+item.name + '.hour', {type: `number`,common: {name: item.hour},native: {}});
            adapter.setObjectAsync('masterdata.'+item.name + '.minute', {type: `number`,common: {name: item.minute},native: {}});
            adapter.setObjectAsync('masterdata.'+item.name + '.datetime', {type: `string`,common: {name: newdate},native: {}});

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