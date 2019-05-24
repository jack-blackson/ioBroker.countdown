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
var AdapterStarted;


let adapter;
startAdapter()

setInterval(function() { 
    // alle 1 Minute ausführen 
    main(); 
}, 60000);

adapter.on('message', obj => {
    adapter.log.info('received message!');

    /*if (obj && obj.command === 'send') {
        processMessage(obj);
    }
    processMessages();
    */
});


function startAdapter(options) {
    options = options || {};
    Object.assign(options, {
        name: 'countdown',
        ready: () => main()
    });

    AdapterStarted = false;

    adapter = new utils.Adapter(options);

    return adapter;
}


function main() {

    if (AdapterStarted == false){
        createObjects()
        clearOldChannels()
        AdapterStarted = true
    }
    if (countdownenabled()) {
        updateresults()
    }
    else{
        adapter.log.info('No active countdown');
    }

    adapter.config.interval = 60000;
    adapter.subscribeStates('*')
}

function clearOldChannels(){
    // clear objects which were deleted in the setup - run once after adapter restart
   var setuparr = [];
   const setuploop = adapter.config.setup;
   for (const item of setuploop){
     setuparr.push(item.name);
   }
   adapter.getAdapterObjects((objects) => {

    for (const id1 of Object.keys(objects)) {
        
        const obj = objects[id1];

        if (obj.type == 'channel'){
            var arraycontains = (setuparr.indexOf(obj.common.name) > -1);
            if (arraycontains == false){
                adapter.deleteChannel(id1)
            }
        }   
    }
  });
}

function createObjects(){
    const setuploop = adapter.config.setup;
    for (const item of setuploop){
        adapter.createState('', item.name, 'name', {
            read: true, 
            write: false, 
            name: "Name", 
            type: "string", 
            def: item.name,
            role: 'value'
          });
        adapter.createState('', item.name, 'active', {
            read: true, 
            write: false, 
            name: "Active", 
            type: "boolean", 
            def: item.active,
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
            def: 0,
            role: 'value'
          });
          adapter.createState('', item.name, 'months', {
            read: true, 
            write: false, 
            name: "Months", 
            type: "number", 
            def: 0,
            role: 'value'
          });
          adapter.createState('', item.name, 'days', {
            read: true, 
            write: false, 
            name: "Days", 
            type: "number", 
            def: 0,
            role: 'value'
          });
          adapter.createState('', item.name, 'hours', {
            read: true, 
            write: false, 
            name: "Hours", 
            type: "number", 
            def: 0,
            role: 'value'
          });
          adapter.createState('', item.name, 'minutes', {
            read: true, 
            write: false, 
            name: "Minutes", 
            type: "number", 
            def: 0,
            role: 'value'
          });
          adapter.createState('', item.name, 'inWordsLong', {
            read: true, 
            write: false, 
            name: "Result in Words Long", 
            type: "string", 
            def: '',
            role: 'value'
          });
          adapter.createState('', item.name, 'inWordsShort', {
            read: true, 
            write: false, 
            name: "Result in Words Short", 
            type: "string", 
            def: '',
            role: 'value'
          });
          adapter.createState('', item.name, 'endDate', {
            read: true, 
            write: false, 
            name: "Enddate", 
            type: "string", 
            def: '',
            role: 'value'
          });
          adapter.createState('', item.name, 'totalDays', {
            read: true, 
            write: false, 
            name: "Total No. of Days", 
            type: "number", 
            def: 0,
            role: 'value'
          });
          adapter.createState('', item.name, 'totalHours', {
            read: true, 
            write: false, 
            name: "Total No. of Hours", 
            type: "number", 
            def: 0,
            role: 'value'
          });
    }
}

function temp(){
    const setuploop = adapter.config.setup;
    //setuploop.replace(/ /g,"_");
        for (const item of setuploop){
        }

        for(var i = 0; i < setuploop.length; i++)
        {
            setuploop[i] = setuploop[i].r.replace(/ /g,"_");
            adapter.log.info('ID:'+setuploop[i]);

        }
}

function updateresults(){
    temp();
    const setuploop = adapter.config.setup;
        for (const item of setuploop){

            let datestring = "";
            datestring = item.day + "." + item.month + "." + item.year + " " + item.hour + ":" + item.minute;

            var newdate = moment(datestring, 'DD.MM.YYYY HH:mm').toDate();
            var newdatelocal = moment(newdate).local().format('YYYY-MM-DD HH:mm');

            var now = moment(new Date()); //todays date
            var duration = moment.duration(now.diff(newdate));
            var years = duration.years() * -1;
            var months = duration.months() * -1;
            var days = duration.days() * -1;
            var hours = duration.hours() * -1;
            var minutes = duration.minutes() * -1;

            adapter.setState({device: item.name , state: 'name'}, {val: item.name, ack: true});
            adapter.setState({device: item.name , state: 'active'}, {val: item.active, ack: true});
            adapter.setState({device: item.name , state: 'endDate'}, {val: newdatelocal, ack: true});



            if (now.diff(newdate) >= 0){
                // Countdown reached today -> disable countdown 
                adapter.setState({device: item.name , state: 'years'}, {val: 0, ack: true});
                adapter.setState({device: item.name , state: 'months'}, {val: 0, ack: true});
                adapter.setState({device: item.name , state: 'days'}, {val: 0, ack: true});
                adapter.setState({device: item.name , state: 'hours'}, {val: 0, ack: true});
                adapter.setState({device: item.name , state: 'minutes'}, {val: 0, ack: true});
                adapter.setState({device: item.name , state: 'inWordsShort'}, {val: '', ack: true});
                adapter.setState({device: item.name , state: 'inWordsLong'}, {val: '', ack: true});
                adapter.setState({device: item.name , state: 'reached'}, {val: true, ack: true});

            }
            else{
                // Countdown not reached -> update values

                var CountDowninWordsShort = '';
                var CountDowninWordsLong = '';

                //years
                if (years != 0){
                    CountDowninWordsShort = years+'Y ';
                    if (years > 1){
                        CountDowninWordsLong = years+'Year ';
                    }
                    else{
                        CountDowninWordsLong = years+'Years ';
                    }
                }

                //months
                if (months != 0 || years != 0){
                    CountDowninWordsShort += months+'M ';

                    if (months > 1){
                        CountDowninWordsLong += months+' Months ';
                    }
                    else{
                        CountDowninWordsLong += months+' Month ';
                    }
                }

                //days
                if (days != 0 || months != 0 || years != 0){
                    CountDowninWordsShort += days+'D ';

                    if (days > 1){
                        CountDowninWordsLong += days+' Days ';
                    }
                    else{
                        CountDowninWordsLong += days+' Day ';
                    }
                }

                //hours
                if (hours != 0 && years == 0 && months == 0){
                    CountDowninWordsShort += hours+'H ';
                    if (hours > 1){
                        CountDowninWordsLong += hours+' Hours ';
                    }
                    else{
                        CountDowninWordsLong += hours+' Hour ';
                    } 
                }

                //minutes
                if (years == 0 && months == 0){
                    CountDowninWordsShort += minutes+'M';
                    if (minutes > 1){
                        CountDowninWordsLong += minutes+' Minutes ';
                    }
                    else{
                        CountDowninWordsLong += minutes+' Minute ';
                    }     
                }
                
                adapter.setState({device: item.name , state: 'years'}, {val: years, ack: true});
                adapter.setState({device: item.name , state: 'months'}, {val: months, ack: true});
                adapter.setState({device: item.name , state: 'days'}, {val: days, ack: true});
                adapter.setState({device: item.name , state: 'hours'}, {val: hours, ack: true});
                adapter.setState({device: item.name , state: 'minutes'}, {val: minutes, ack: true});
                adapter.setState({device: item.name , state: 'inWordsShort'}, {val: CountDowninWordsShort, ack: true});
                adapter.setState({device: item.name , state: 'inWordsLong'}, {val: CountDowninWordsLong, ack: true});
                adapter.setState({device: item.name , state: 'reached'}, {val: false, ack: true});
                adapter.setState({device: item.name , state: 'totalDays'}, {val: mydiff(Date(),newdate,"days"), ack: true});
                adapter.setState({device: item.name , state: 'totalHours'}, {val: mydiff(Date(),newdate,"hours"), ack: true});


            }

        }
}

function mydiff(date1,date2,interval) {
    var second=1000, minute=second*60, hour=minute*60, day=hour*24, week=day*7;
    date1 = new Date(date1);
    date2 = new Date(date2);
    var timediff = date2 - date1;
    if (isNaN(timediff)) return NaN;
    switch (interval) {
        case "years": return date2.getFullYear() - date1.getFullYear();
        case "months": return (
            ( date2.getFullYear() * 12 + date2.getMonth() )
            -
            ( date1.getFullYear() * 12 + date1.getMonth() )
        );
        case "weeks"  : return Math.floor(timediff / week);
        case "days"   : return Math.floor(timediff / day); 
        case "hours"  : return Math.floor(timediff / hour); 
        case "minutes": return Math.floor(timediff / minute);
        case "seconds": return Math.floor(timediff / second);
        default: return undefined;
    }
}

function countdownenabled(){
    var alarmactive = false;
    // Check if there are active countdowns
    if (adapter.config.setup) {
        const setuploop = adapter.config.setup;
        for (const item of setuploop){
            if (item.active == true){
                alarmactive = true;
            }
        }
    }
    return alarmactive

} 
