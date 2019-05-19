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
    //updatemasterdataobjects()
    //cleanresults()
    createObjects()
    if (countdownenabled()) {
        //updateresults()
    }
    else{
        adapter.log.info('No active countdown');
    }

    adapter.config.interval = 60000;
    adapter.subscribeStates('*')
}

function createObjects(){
    const setup = adapter.config.setup;
    for (const item of setup){
        adapter.createState('', item.name, 'name', {
            read: true, 
            write: false, 
            name: "Name", 
            type: "string", 
            def: false,
            role: 'value'
          });
        adapter.createState('', item.name, 'active', {
            read: true, 
            write: false, 
            name: "Active", 
            type: "boolean", 
            def: false,
            role: 'value'
          });
          adapter.createState('', item.name, 'reached', {
            read: true, 
            write: false, 
            name: "Reached", 
            type: "boolean", 
            def: false,
            role: 'value'
          });
          adapter.createState('', item.name, 'years', {
            read: true, 
            write: false, 
            name: "Years", 
            type: "number", 
            def: false,
            role: 'value'
          });
          adapter.createState('', item.name, 'months', {
            read: true, 
            write: false, 
            name: "Months", 
            type: "number", 
            def: false,
            role: 'value'
          });
          adapter.createState('', item.name, 'days', {
            read: true, 
            write: false, 
            name: "Days", 
            type: "number", 
            def: false,
            role: 'value'
          });
          adapter.createState('', item.name, 'hours', {
            read: true, 
            write: false, 
            name: "Hours", 
            type: "number", 
            def: false,
            role: 'value'
          });
          adapter.createState('', item.name, 'minutes', {
            read: true, 
            write: false, 
            name: "Minutes", 
            type: "number", 
            def: false,
            role: 'value'
          });
          adapter.createState('', item.name, 'inWordsLong', {
            read: true, 
            write: false, 
            name: "Result in Words Long", 
            type: "string", 
            def: false,
            role: 'value'
          });
          adapter.createState('', item.name, 'inWordsShort', {
            read: true, 
            write: false, 
            name: "Result in Words Short", 
            type: "string", 
            def: false,
            role: 'value'
          });
    }
}

function updateresults(){
    const setup = adapter.config.setup;
        for (const item of setup){

           



            //adapter.setObjectAsync(item.name + '.active', {type: `boolean`,common: {name: item.active},native: {}});
            //adapter.setObjectAsync(item.name + '.name', {type: `string`,common: {name: item.name},native: {}});

            let datestring = "";
            datestring = item.day + "." + item.month + "." + item.year + " " + item.hour + ":" + item.minute;

            var newdate = moment(datestring, 'DD.MM.YYYY HH:mm').toDate();
            //adapter.setObjectAsync(item.name + '.enddate', {type: `string`,common: {name: newdate},native: {}});

            var now = moment(new Date()); //todays date
            var duration = moment.duration(now.diff(newdate));
            var years = duration.years() * -1;
            var months = duration.months() * -1;
            var days = duration.days() * -1;
            var hours = duration.hours() * -1;
            var minutes = duration.minutes() * -1;


            adapter.setState(item + ".name", item.name);  
            adapter.setState(item + ".active", item.active);  
            


            if (now.diff(newdate) >= 0){
                // Countdown reached today -> disable countdown
                //adapter.setObjectAsync(item.name + '.reached', {type: `boolean`,common: {name: true},native: {}});
                //adapter.setObjectAsync(item.name + '.year', {type: `number`,common: {name: ''},native: {}});
                //adapter.setObjectAsync(item.name + '.month', {type: `number`,common: {name: ''},native: {}});
                //adapter.setObjectAsync(item.name + '.day', {type: `number`,common: {name: ''},native: {}});
                //adapter.setObjectAsync(item.name + '.hour', {type: `number`,common: {name: ''},native: {}});
                //adapter.setObjectAsync(item.name + '.minute', {type: `number`,common: {name: ''},native: {}});
                adapter.setState(item + ".years", 0);  
                adapter.setState(item + ".months", 0);  
                adapter.setState(item + ".days", 0);  
                adapter.setState(item + ".hours", 0);  
                adapter.setState(item + ".minutes", 0);  
                adapter.setState(item + ".InWordsShort", '');  
                adapter.setState(item + ".InWordsLong", '');  
                adapter.setState(item + ".reached", true);  

            }
            else{
                // Countdown not reached -> update values
                //adapter.setObjectAsync(item.name + '.reached', {type: `boolean`,common: {name: false},native: {}});
                //adapter.setObjectAsync(item.name + '.year', {type: `number`,common: {name: years},native: {}});
                //adapter.setObjectAsync(item.name + '.month', {type: `number`,common: {name: months},native: {}});
                //adapter.setObjectAsync(item.name + '.day', {type: `number`,common: {name: days},native: {}});
                //adapter.setObjectAsync(item.name + '.hour', {type: `number`,common: {name: hours},native: {}});
                //adapter.setObjectAsync(item.name + '.minute', {type: `number`,common: {name: minutes},native: {}});

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
                //adapter.setObjectAsync(item.name + '.inwordsshort', {type: `string`,common: {name: CountDowninWordsShort},native: {}});

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
                //adapter.setObjectAsync(item.name + '.inwordslong', {type: `string`,common: {name: CountDowninWordsLong},native: {}});

                adapter.setState(item + ".years", years);  
                adapter.setState(item + ".months", months);  
                adapter.setState(item + ".days", days);  
                adapter.setState(item + ".hours", hours);  
                adapter.setState(item + ".minutes", minutes);  
                adapter.setState(item + ".inWordsShort", CountDowninWordsLong);  
                adapter.setState(item + ".inWordsLong", CountDowninWordsShort);  
                adapter.setState(item + ".reached", false);  

            }

            

            //adapter.setObjectAsync('results.'+item.name, {type: `channel`,common: {name: item.name},native: {}});
            //adapter.setObjectAsync('results.'+item.name + '.name', {type: `string`,common: {name: item.name},native: {}});

        }
}

/*
function updatemasterdataobjects(){
    if (adapter.config.setup) {
        const setup = adapter.config.setup;
        for (const item of setup){
            let datestring = "";
            datestring = item.day + "." + item.month + "." + item.year + " " + item.hour + ":" + item.minute;

            var newdate = moment(datestring, 'DD.MM.YYYY HH:mm').toDate();

            adapter.setObjectAsync(item.name, {type: `device`,common: {name: item.name},native: {}});
            adapter.setObjectAsync(item.name + ".masterdata" , {type: `channel`,common: {name: 'masterdata'},native: {}});

           
            
            adapter.setObjectAsync(item.name + ".masterdata" + '.year', {type: `number`,common: {name: item.year},native: {}});
            adapter.setObjectAsync(item.name + ".masterdata" + '.month', {type: `number`,common: {name: item.month},native: {}});
            adapter.setObjectAsync(item.name + ".masterdata" + '.day', {type: `number`,common: {name: item.day},native: {}});
            adapter.setObjectAsync(item.name + ".masterdata" + '.hour', {type: `number`,common: {name: item.hour},native: {}});
            adapter.setObjectAsync(item.name + ".masterdata" + '.minute', {type: `number`,common: {name: item.minute},native: {}});
            adapter.setObjectAsync(item.name + ".masterdata" + '.datetime', {type: `string`,common: {name: newdate},native: {}});

        }
    }
    else{
        // no countdown available
    }
}
*/

/*
const tasks = [];

function insertIntoList(key, value, unit) {

    try {

        adapter.log.debug('insert ' + key + ' with ' + value  );

        let obj;
        let d = key.match(/Day_(\d)\./);
        if (d) {
            d = parseInt(d[1], 10) - 1;
            if (key.match(/\.Location$/)) {
                obj = {
                    type: 'state',
                    common: {
                        name: 'Active',
                        type: 'string',
                        role: 'active',
                        read: true,
                        write: false
                    }
                };
            
            } else if (key.match(/\.Tag_value/)) {
                obj = {
                    type: 'state',
                    common: {
                        name: 'Day name',
                        type: 'string',
                        role: 'dayofweek.forecast.' + d,
                        read: true,
                        write: false
                    }
                };
            } else if (key.match(/\.Wetter_Symbol_id/) || key.match(/\.Wetter_Symbol_id2/)) {
                obj = {
                    type: 'state',
                    common: {
                        name: 'Weather icon name',
                        type: 'number',
                        role: 'weather.icon.name.forecast.' + d,

                        read: true,
                        write: false
                    }
                };

            } else if (key.match(/\.sun_out/)) {
                obj = {
                    type: 'state',
                    common: {
                        name: 'sun set',
                        type: 'string',
                        role: 'weather.sun.out.forecast.' + d,

                        read: true,
                        write: false
                    }
                };
            }
        }

        obj = obj || {
            type: 'state',
            common: {
                name: 'data',
                type: 'string',
                role: 'state',
                unit: '',
                read: true,
                write: false
            }
        };

        tasks.push({
            name: 'add',
            key: key,
            obj: obj,
            value: value
        });

    } catch (e) {
        adapter.log.error('exception in insertIntoList [' + e + ']');
    }
}
*/



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