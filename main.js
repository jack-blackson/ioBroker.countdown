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
const tableify = require(`tableify`);
const moment = require('moment');
var AdapterStarted;

var arrtableLong = [];
var arrtableShort = [];
var textYear = '';
var textYears = '';
var textYearsShort = '';
var textMonth = '';
var textMonths = '';
var textMonthsShort = '';
var textDay = '';
var textDays = '';
var textDaysShort = '';
var textHour = '';
var textHours = '';
var textHoursShort = '';
var textMinute = '';
var textMinutes = '';
var textMinutesShort = '';



let adapter;
startAdapter()

setInterval(function() { 
    // alle 1 Minute ausführen 
    main(); 
}, 60000);

adapter.on('message', obj => {
    adapter.log.info('received message!');

    if (obj && obj.command === 'send') {
        processMessage(obj);
    }
    
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
        adapter.setObjectNotExists('setup', {
            common: {
                  name: 'Countdown Masterdata'
            },
            type: 'device',
            'native' : {}
        });
        adapter.setObjectNotExists('countdowns', {
            common: {
                  name: 'Countdown Details'
            },
            type: 'device',
            'native' : {}
        });

        adapter.createState('', '', 'jsonContentLong', {
            read: true, 
            write: false, 
            name: "HTML Content Countdown Long", 
            type: "string", 
            def: '',
            role: 'value'
          });
          adapter.createState('', '', 'jsonContentShort', {
            read: true, 
            write: false, 
            name: "HTML Content Countdown Short", 
            type: "string", 
            def: '',
            role: 'value'
          });
          getVariableTranslation()
        AdapterStarted = true
    }

    loopsetup()

    adapter.config.interval = 60000;
    adapter.subscribeStates('*')
}

function loopsetup(){
    arrtableLong = [];
    arrtableShort = [];

    arrtableLong.push(['Name','Value']);
    arrtableShort.push(['Name','Value']);

    adapter.getStatesOf("countdown.0.setup", function(error, result) {
        for (const id1 of result) {
            adapter.getForeignState('countdown.0.setup.' + id1.common.name.replace(/ /g,"_"), function (err, state) {
                //prüfen ob Device schon vorhanden ist
                adapter.getForeignState('countdown.0.countdowns.' + id1.common.name.replace(/ /g,"_") + '.name', function (err1, result1) {
                    if(result1 === null && typeof result1 === "object") {
                        createObjects(id1.common.name);
                        setTimeout(function() {
                            // Code, der erst nach 5 Sekunden ausgeführt wird
                            createCountdownData(id1.common.name,state.val)
                        }, 5000);
                    }
                    else{
                        createCountdownData(id1.common.name,state.val)
                    }
                });
            });

        }
        setTimeout(function() {
            // Code, der erst nach 5 Sekunden ausgeführt wird
            createCountdownTable()
        }, 5000);
    });
}

function getVariableTranslation(){
    switch (adapter.config.descLanguage) {
        case 'de':
            textYear = 'Jahr';
            textYears = 'Jahre';
            textYearsShort = 'J';
            textMonth = 'Monat';
            textMonths = 'Monate';
            textMonthsShort = 'M';
            textDay = 'Tag';
            textDays = 'Tage';
            textDaysShort = 'T';
            textHour = 'Stunde';
            textHours = 'Stunden';
            textHoursShort = 'S';
            textMinute = 'Minute';
            textMinutes = 'Minuten';          
            textMinutesShort = 'M';
        case 'en':
            textYear = 'Year';
            textYears = 'Years';
            textYearsShort = 'Y';
            textMonth = 'Month';
            textMonths = 'Months';
            textMonthsShort = 'M'
            textDay = 'Day';
            textDays = 'Days';
            textDaysShort = 'D';
            textHour = 'Hour';
            textHours = 'Hours';
            textHoursShort = 'H';
            textMinute = 'Minute';
            textMinutes = 'Minutes';         
            textMonthsShort = 'M';
        default:
          // Anweisungen werden ausgeführt,
          // falls keine der case-Klauseln mit expression übereinstimmt
      }
      adapter.log.info('Sprache: ' + adapter.config.descLanguage);
      adapter.log.info('texthours: ' + textHours);
}


function createCountdownData(CountName, CountDate){

    var newdate = moment(CountDate, 'YYYY.MM.DD HH:mm:ss').toDate();

    var newdatelocal = moment(newdate).local().format('YYYY-MM-DD HH:mm');

    var now = moment(new Date()); //todays date
    var duration = moment.duration(now.diff(newdate));        
    var years = duration.years() * -1;
    var months = duration.months() * -1;
    var days = duration.days() * -1;
    var hours = duration.hours() * -1;
    var minutes = duration.minutes() * -1;

    var storagename = CountName.replace(/ /g,"_");

    adapter.setState({device: 'countdowns' , channel: storagename, state: 'name'}, {val: CountName, ack: true});
    adapter.setState({device: 'countdowns' , channel: storagename, state: 'endDate'}, {val: newdatelocal, ack: true});



    if (now.diff(newdate) >= 0){
        // Countdown reached today -> disable countdown 
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'years'}, {val: 0, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'months'}, {val: 0, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'days'}, {val: 0, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'hours'}, {val: 0, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'minutes'}, {val: 0, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'inWordsShort'}, {val: '', ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'inWordsLong'}, {val: '', ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'reached'}, {val: true, ack: true});

    }
    else{
        // Countdown not reached -> update values

        var CountDowninWordsShort = '';
        var CountDowninWordsLong = '';

        //years
        if (years != 0){
            CountDowninWordsShort = years+textYearsShort;
            if (years > 1){
                CountDowninWordsLong = years+textYears;
            }
            else{
                CountDowninWordsLong = years+textYear;
            }
        }

        //months
        if (months != 0 || years != 0){
            CountDowninWordsShort += months+textMonthsShort;

            if (months > 1){
                CountDowninWordsLong += months+ textMonths;
            }
            else{
                CountDowninWordsLong += months+ textMonth;
            }
        }

        //days
        if (days != 0 || months != 0 || years != 0){
            CountDowninWordsShort += days+textDaysShort;

            if (days > 1){
                CountDowninWordsLong += days+ textDays;
            }
            else{
                CountDowninWordsLong += days+ textDay;
            }
        }

        //hours
        if (hours != 0 && years == 0 && months == 0){
            CountDowninWordsShort += hours+textHoursShort;
            if (hours > 1){
                CountDowninWordsLong += hours+ textHours;
            }
            else{
                CountDowninWordsLong += hours+textHour;
            } 
        }

        //minutes
        if (years == 0 && months == 0){
            CountDowninWordsShort += minutes+textMinutesShort;
            if (minutes > 1){
                CountDowninWordsLong += minutes+ textMinutes;
            }
            else{
                CountDowninWordsLong += minutes+textMinute;
            }     
        }
                
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'years'}, {val: years, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'months'}, {val: months, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'days'}, {val: days, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'hours'}, {val: hours, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'minutes'}, {val: minutes, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'inWordsShort'}, {val: CountDowninWordsShort, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'inWordsLong'}, {val: CountDowninWordsLong, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'reached'}, {val: false, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'totalDays'}, {val: mydiff(Date(),newdate,"days"), ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'totalHours'}, {val: mydiff(Date(),newdate,"hours"), ack: true});   

        var arrlineLong = [CountName,CountDowninWordsLong];
        arrtableLong.push(arrlineLong);

        var arrlineShort = [CountName,CountDowninWordsShort];
        arrtableShort.push(arrlineShort);
    }
}



function processMessage(obj){
    var year = 0
    var month = '0'
    var day = '0'
    var hour = '01'
    var minute = '01'
    var name = obj.message.name
    var erroroccured = false

    if (typeof obj.message.date != 'undefined'){
        if (obj.message.date != ''){
            
            adapter.createState('', 'setup', name, {
                read: true, 
                write: false, 
                name: name, 
                type: "string", 
                def: obj.message.date,
                role: 'value'
            
        });
        }
    }    
    else
    {
        if (obj.message.year != ''){
            if(obj.message.year === '' + parseInt(obj.message.year)){
                // is int
                year = obj.message.year;
            }
            else
            {
                adapter.log.error('Could not create alarm as year value is no int!');
                erroroccured = true;
            }
        }
        if (obj.message.month != ''){
            if(obj.message.month === '' + parseInt(obj.message.month)){
                // is int
                if (obj.message.month <=9) {
                    month = '0' + obj.message.month;
                }
                else{
                    month = obj.message.month;
                }
            }
            else
            {
                adapter.log.error('Could not create alarm as month value is no int!');
                erroroccured = true;
    
            }
        }
        if (obj.message.day != ''){
            if(obj.message.day === '' + parseInt(obj.message.day)){
                // is 
                if (obj.message.month <=9) {
                    day = '0' + obj.message.day;
                }
                else{
                    day = obj.message.day;
                }
            }
            else
            {
                adapter.log.error('Could not create alarm as day value is no int!');
                erroroccured = true;
    
            }
        }
        if (obj.message.hour != ''){
            if(obj.message.hour === '' + parseInt(obj.message.hour)){
                // is int
                if (obj.message.hour <=9) {
                    hour = '0' + obj.message.hour;
                }
                else{
                    hour = obj.message.hour;
                }
            }
            else
            {
                adapter.log.error('Could not create alarm as hour value is no int!');
                erroroccured = true;
    
            }
        }
        if (obj.message.minute != ''){
            if(obj.message.minute === '' + parseInt(obj.message.minute)){
                // is int
                if (obj.message.minute <=9) {
                    minute = '0' + obj.message.minute;
                }
                else{
                    minute = obj.message.minute;
                }
            }
            else
            {
                adapter.log.error('Could not create alarm as minute value is no int!');
                erroroccured = true;
    
            }
        }
    
        if (erroroccured == false){
            var datestring = year + "." + month + "." + day + " " + hour + ":" + minute + ":00";
            adapter.createState('', 'setup', name, {
                read: true, 
                write: false, 
                name: name, 
                type: "string", 
                def: datestring,
                role: 'value'
              });
        }
    }
    setTimeout(function() {
        // Code, der erst nach 5 Sekunden ausgeführt wird
        loopsetup()
    }, 5000);
}

function createCountdownTable(){

    adapter.log.info('Countdowntabelle erstellen');

    /*



    var i=0;


    adapter.getStatesOf("countdown.0.countdowns", function(error, result) {
        for (const id1 of result) { 
            //const obj = objects[id1];
   
           // if (obj.type == 'channel'){
            adapter.log.info('Countdowntabelle erstellen für:' + id1.common.name);

            adapter.getForeignState('countdown.0.countdowns.' + id1.common.name.replace(/ /g,"_") + '.inWordsLong', function (err, state) {
               var arrlineLong = [id1.common.name.replace,state.val];
               arrtableLong.push(arrlineLong);
           });               
           adapter.getForeignState('countdown.0.countdowns.' + id1.common.name.replace(/ /g,"_") + '.inWordsShort', function (err, state) {   
            var arrlineShort = [id1.common.name.replace,state.val];
            arrtableShort.push(arrlineShort);
           });
        }
    });
    */


   adapter.log.info('Countdowntabelle jsonify:' + JSON.stringify(arrtableLong));
   adapter.setState({ state: 'jsonContentLong'}, {val: JSON.stringify(arrtableLong), ack: true});
   adapter.setState({ state: 'jsonContentShort'}, {val: JSON.stringify(arrtableShort), ack: true});

    /*
    adapter.setState({ state: 'htmlContentLong'}, {val: tableify(arrtableLong), ack: true});
    adapter.setState({ state: 'htmlContentShort'}, {val: tableify(arrtableShort), ack: true});
    */
    /*
    adapter.getAdapterObjects((objects) => { 
     for (const id1 of Object.keys(objects)) { 
         const obj = objects[id1];

         if (obj.type == 'channel'){

            adapter.getForeignState('countdown.0.' + id1.replace(/ /g,"_") + '.inWordsLong', function (err, state) {
                var arrlineLong = [];
                arrtableLong.push(state.val);
            });
            adapter.getForeignState('countdown.0.' + id1.replace(/ /g,"_") + '.inWordsShort', function (err, state) {
                var arrlineShort = [];
                arrtableShort.push(state.val);
            });
         }   
     }
     */
   //});
}

/*
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
*/

function createObjects(CountName){
    adapter.setObjectNotExists('countdowns.' + CountName.replace(/ /g,"_"), {
        common: {
              name: CountName
        },
        type: 'channel',
        'native' : {}
    });
    adapter.createState('countdowns', CountName, 'name', {
        read: true, 
        write: false, 
        name: "Name", 
        type: "string", 
        def: CountName,
        role: 'value'
    });
      
    adapter.createState('countdowns', CountName, 'reached', {
        read: true, 
        write: false, 
        name: "Reached", 
        type: "boolean", 
        def: false,
        role: 'value'
    });

    adapter.createState('countdowns', CountName, 'years', {
        read: true, 
        write: false, 
        name: "Years", 
        type: "number", 
        def: 0,
        role: 'value'
    });

      adapter.createState('countdowns', CountName, 'months', {
        read: true, 
        write: false, 
        name: "Months", 
        type: "number", 
        def: 0,
        role: 'value'
      });

      adapter.createState('countdowns', CountName, 'days', {
        read: true, 
        write: false, 
        name: "Days", 
        type: "number", 
        def: 0,
        role: 'value'
      });

      adapter.createState('countdowns', CountName, 'hours', {
        read: true, 
        write: false, 
        name: "Hours", 
        type: "number", 
        def: 0,
        role: 'value'
      });

      adapter.createState('countdowns', CountName, 'minutes', {
        read: true, 
        write: false, 
        name: "Minutes", 
        type: "number", 
        def: 0,
        role: 'value'
      });

      adapter.createState('countdowns', CountName, 'inWordsLong', {
        read: true, 
        write: false, 
        name: "Result in Words Long", 
        type: "string", 
        def: '',
        role: 'value'
      });

      adapter.createState('countdowns', CountName, 'inWordsShort', {
        read: true, 
        write: false, 
        name: "Result in Words Short", 
        type: "string", 
        def: '',
        role: 'value'
      });

      adapter.createState('countdowns', CountName, 'endDate', {
        read: true, 
        write: false, 
        name: "Enddate", 
        type: "string", 
        def: '',
        role: 'value'
      });

      adapter.createState('countdowns', CountName, 'totalDays', {
        read: true, 
        write: false, 
        name: "Total No. of Days", 
        type: "number", 
        def: 0,
        role: 'value'
      });

      adapter.createState('countdowns', CountName, 'totalHours', {
        read: true, 
        write: false, 
        name: "Total No. of Hours", 
        type: "number", 
        def: 0,
        role: 'value'
      });
      
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