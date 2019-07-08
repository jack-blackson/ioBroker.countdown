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
const tableify = require(`tableify`);
var AdapterStarted;

var tableArray = [];
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
let objects = null;

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

        adapter.createState('', '', 'jsonContent', {
            read: true, 
            write: false, 
            name: "JSON Content", 
            type: "string", 
            def: '',
            role: 'value'
        });

        adapter.createState('', '', 'htmlContent', {
            read: true, 
            write: false, 
            name: "HTML Content", 
            type: "string", 
            def: '',
            role: 'value'
        });

        getVariableTranslation()
        AdapterStarted = true
    }

    loopsetup()

    cleanresults()

    adapter.config.interval = 60000;
    adapter.subscribeStates('*')
}

function cleanresults(CountName){
    // clean results when a setup is deleted
    if(CountName == null){
        // function started without parameter from normal loop
        adapter.getChannelsOf('countdowns', function (err, result) {
            for (const channel of result) {
                adapter.getForeignState('countdown.0.setup.' + channel.common.name.replace(/ /g,"_"), function (err, state) {
                    //check if setup is still existing
                    if(state === null && typeof state === "object") {
                        //if not - delete results
                        deleteCountdownResults(channel.common.name)
                    }
                });   
            }
          });
    }
    else{
        // function started with parameter Name - not necessary yet

    }
}

function deleteCountdownResults(CountName){
    adapter.deleteChannel('countdowns',CountName.replace(/ /g,"_"));
}

function deleteCountdownSetup(CountName){
    adapter.deleteState('setup','',CountName.replace(/ /g,"_"));
}


function loopsetup(){
    tableArray = [];

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
            // Code, der erst nach 10 Sekunden ausgeführt wird
            createCountdownTable()
        }, 10000);
    });
}

function getVariableTranslation(){
    var language = ''
    adapter.getForeignObject('system.config', (err, systemConfig) => {
        language = systemConfig.common.language

        switch (language) {
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
                break;
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
                textMinutesShort = 'M';
                break;
    
            default:
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
                    textMinutesShort = 'M';
                    break;
          }

    });
}


function createCountdownData(CountName, CountDate){

    var newdate = moment(CountDate, 'DD.MM.YYYY HH:mm:ss').toDate();


    switch (adapter.config.dateFormat) {
        case "EuropeDot": var newdatelocal = moment(newdate).local().format('DD.MM.YYYY HH:mm');
                        break;
        case "EuropeMinus": var newdatelocal = moment(newdate).local().format('DD-MM-YYYY HH:mm');
                            break;
        case "USDot"  : var newdatelocal = moment(newdate).local().format('MM.DD.YYYY HH:MM');
                        break;
        case "USMinuts"   : var newdatelocal = moment(newdate).local().format('MM-DD-YYYY HH.MM');
                        break;
        default: var newdatelocal = moment(newdate).local().format('DD.MM.YYYY HH:mm');
    }

    

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
        // Countdown reached now -> disable countdown 
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'years'}, {val: 0, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'months'}, {val: 0, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'days'}, {val: 0, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'hours'}, {val: 0, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'minutes'}, {val: 0, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'inWordsShort'}, {val: '', ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'inWordsLong'}, {val: '', ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'reached'}, {val: true, ack: true});

        if (adapter.config.autodelete){
            deleteCountdownSetup(CountName)
            deleteCountdownResults(CountName)
        }
    }
    else{
        // Countdown not reached -> update values

        var CountDowninWordsShort = '';
        var CountDowninWordsLong = '';

        //years
        if (years != 0){
            CountDowninWordsShort = years+ textYearsShort;
            if (years > 1){
                CountDowninWordsLong = years+' ' +  textYears;
            }
            else{
                CountDowninWordsLong = years+' ' +  textYear;
            }
        }

        //months
        if (months != 0 || years != 0){
            CountDowninWordsShort += ' ' + months+textMonthsShort;

            if (months > 1){
                CountDowninWordsLong += ' ' + months+ ' ' + textMonths;
            }
            else{
                CountDowninWordsLong += ' ' + months+ ' ' + textMonth;
            }
        }

        //days
        if (days != 0 || months != 0 || years != 0){
            CountDowninWordsShort += ' ' + days+textDaysShort;

            if (days > 1){
                CountDowninWordsLong += ' ' + days+ ' ' + textDays;
            }
            else{
                CountDowninWordsLong += ' ' + days+ ' ' + textDay;
            }
        }

        //hours
        if (hours != 0 && years == 0 && months == 0){
            CountDowninWordsShort += ' ' + hours+textHoursShort;
            if (hours > 1){
                CountDowninWordsLong += ' ' + hours+ ' ' + textHours;
            }
            else{
                CountDowninWordsLong += ' ' + hours+' ' + textHour;
            } 
        }

        //minutes
        if (years == 0 && months == 0){
            CountDowninWordsShort += ' ' + minutes+textMinutesShort;
            if (minutes > 1){
                CountDowninWordsLong += ' ' + minutes+ ' ' + textMinutes;
            }
            else{
                CountDowninWordsLong += ' ' + minutes+' ' + textMinute;
            }     
        }

        var totalDays = mydiff(Date(),newdate,"days");
        var totalHours = mydiff(Date(),newdate,"hours");
        var totalWeeks = mydiff(Date(),newdate,"weeks");

                
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'years'}, {val: years, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'months'}, {val: months, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'days'}, {val: days, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'hours'}, {val: hours, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'minutes'}, {val: minutes, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'inWordsShort'}, {val: CountDowninWordsShort, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'inWordsLong'}, {val: CountDowninWordsLong, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'reached'}, {val: false, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'totalDays'}, {val: totalDays, ack: true});
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'totalHours'}, {val: totalHours, ack: true});   
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'totalWeeks'}, {val: totalWeeks, ack: true});   


        var tableContent = adapter.config.tablefields;
        var tableContentTemp = []
        tableContentTemp.push(CountName)

        if (adapter.config.inWordsShort){
            tableContentTemp.push(CountDowninWordsShort)
        }

        if (adapter.config.inWordsLong){
            tableContentTemp.push(CountDowninWordsLong)
        }

        if (adapter.config.totalNoOfDays){
            tableContentTemp.push(totalDays)
        }

        if (adapter.config.totalNoOfHours){
            tableContentTemp.push(totalHours)
        }

        if (adapter.config.totalNoOfWeeks){
            tableContentTemp.push(totalWeeks)
        }

        if (adapter.config.endDate){
            tableContentTemp.push(newdatelocal)
        }

        tableArray.push(tableContentTemp);

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
            switch (adapter.config.dateFormat) {
                case "EuropeDot": 
                                var messageDate = moment(obj.message.date, 'DD.MM.YYYY HH:mm').toDate();
                                break;
                case "EuropeMinus": 
                                 var messageDate = moment(obj.message.date, 'DD-MM-YYYY HH:mm').toDate();
                                break;
                case "USDot"  : 
                                var messageDate = moment(obj.message.date, 'MM.DD.YYYY HH:MM').toDate();
                                break;
                case "USMinuts"   : 
                                var messageDate = moment(obj.message.date, 'MM-DD-YYYY HH.MM').toDate();
                                break;
                default: var messageDate = moment(obj.message.date, 'DD.MM.YYYY HH:mm').toDate();
                ;
            }



            var messageDateString = moment(messageDate).format('DD') + '.' + moment(messageDate).format('MM') + '.' + 
                                    moment(messageDate).format('YYYY') + ' ' + moment(messageDate).format('HH') + ':' + 
                                    moment(messageDate).format('mm') + ':00' 
             
            if (moment(messageDateString, 'DD.MM.YYYY HH:mm:ss',true).isValid()) {
                adapter.createState('', 'setup', name, {
                    read: true, 
                    write: true, 
                    name: name, 
                    type: "string", 
                    def: messageDateString,
                    role: 'value'
                
                });
                adapter.log.info('Created Countdown ' + name + ': ' + messageDateString);
            }
            else{
                // invalid date
                adapter.log.error('Date for countdown ' + name + ' is invalid: ' + obj.message.date)
            }
        }
    }    
    
    else if (typeof obj.message.addminutes != 'undefined'){
        if (obj.message.addminutes != '' && obj.message.addminutes != '0' && parseInt(obj.message.addminutes)){             
            var now = new Date(); //todays date
            var toAdd = Number(obj.message.addminutes)
            var newDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()+ toAdd)
            var messageDateString = moment(newDate).format('DD') + '.' + moment(newDate).format('MM') + '.' + 
                                        moment(newDate).format('YYYY') + ' ' + moment(newDate).format('HH') + ':' + 
                                        moment(newDate).format('mm') + ':00' 
    
    
            adapter.createState('', 'setup', name, {
                    read: true, 
                    write: true, 
                    name: name, 
                    type: "string", 
                    def: messageDateString,
                    role: 'value'
                
                });
                adapter.log.info('Created Countdown ' + name + ': ' + messageDateString);
            }
        else{
                adapter.log.error(name + ': Adding ' + obj.message.addminutes + ' is invalid')
        }
    }
    else if (typeof obj.message.addhours != 'undefined'){
        if (obj.message.addhours != '' && obj.message.addhours != '0' && parseInt(obj.message.addhours)){            
             
            var now = new Date(); //todays date
            var toAdd = Number(obj.message.addhours)
            var newDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()+ toAdd, now.getMinutes())
            var messageDateString = moment(newDate).format('DD') + '.' + moment(newDate).format('MM') + '.' + 
                                        moment(newDate).format('YYYY') + ' ' + moment(newDate).format('HH') + ':' + 
                                        moment(newDate).format('mm') + ':00' 
    
    
            adapter.createState('', 'setup', name, {
                    read: true, 
                    write: true, 
                    name: name, 
                    type: "string", 
                    def: messageDateString,
                    role: 'value'
                
            });
            adapter.log.info('Created Countdown ' + name + ': ' + messageDateString);
        }
        else{
            adapter.log.error(name + ': Adding ' + obj.message.addhours + ' is invalid')
        }
    }
    else if (typeof obj.message.adddays != 'undefined'){
        if (obj.message.adddays != '' && obj.message.adddays != '0' && parseInt(obj.message.adddays)){            
            var now = new Date(); //todays date
            var toAdd = Number(obj.message.adddays)
            var newDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + toAdd, now.getHours(), now.getMinutes())
    
            var messageDateString = moment(newDate).format('DD') + '.' + moment(newDate).format('MM') + '.' + 
                                        moment(newDate).format('YYYY') + ' ' + moment(newDate).format('HH') + ':' + 
                                        moment(newDate).format('mm') + ':00' 
    
    
            adapter.createState('', 'setup', name, {
                    read: true, 
                    write: true, 
                    name: name, 
                    type: "string", 
                    def: messageDateString,
                    role: 'value'
                
            });
            adapter.log.info('Created Countdown ' + name + ': ' + messageDateString);
    
        }
        
        else{
            adapter.log.error(name + ': Adding ' + obj.message.adddays + ' is invalid')
        }
    }
    else if (typeof obj.message.addmonths != 'undefined'){
        if (obj.message.addmonths != ''&& obj.message.addmonths != '0' && parseInt(obj.message.addmonths)){            
            var now = new Date(); //todays date
            var toAdd = Number(obj.message.addmonths)

            var newDate = new Date(now.getFullYear(), now.getMonth() + toAdd, now.getDate(), now.getHours(), now.getMinutes())

            var messageDateString = moment(newDate).format('DD') + '.' + moment(newDate).format('MM') + '.' + 
                                    moment(newDate).format('YYYY') + ' ' + moment(newDate).format('HH') + ':' + 
                                    moment(newDate).format('mm') + ':00' 


            adapter.createState('', 'setup', name, {
                read: true, 
                write: true, 
                name: name, 
                type: "string", 
                def: messageDateString,
                role: 'value'
            
            });
            adapter.log.info('Created Countdown ' + name + ': ' + messageDateString);

        }
        else{
            adapter.log.error(name + ': Adding ' + obj.message.addmonths + ' is invalid')
        }
    }
    else if (typeof obj.message.addyears != 'undefined'){
        if (obj.message.addyears != '' && obj.message.addyears != '0' && parseInt(obj.message.addyears)){            
         
            var now = new Date(); //todays date
            var toAdd = Number(obj.message.addyears)
            var newDate = new Date(now.getFullYear() + toAdd, now.getMonth(), now.getDate(), now.getHours(), now.getMinutes())
            var messageDateString = moment(newDate).format('DD') + '.' + moment(newDate).format('MM') + '.' + 
                                    moment(newDate).format('YYYY') + ' ' + moment(newDate).format('HH') + ':' + 
                                    moment(newDate).format('mm') + ':00' 


            adapter.createState('', 'setup', name, {
                read: true, 
                write: true, 
                name: name, 
                type: "string", 
                def: messageDateString,
                role: 'value'
            
            });
            adapter.log.info('Created Countdown ' + name + ': ' + messageDateString);
        }
        else{
            adapter.log.error(name + ': Adding ' + obj.message.addyears + ' is invalid')
        }
    }
    else if (countProperties(obj.message) >= 2 && typeof obj.message.year != 'undefined')
    {
        if (obj.message.year != ''){
            var messageyear = obj.message.year
            if(messageyear === '' + parseInt(messageyear)){
                // is int
                year = messageyear;
            }
            else
            {
                adapter.log.error('Could not create alarm as year value is no int!');
                erroroccured = true;
            }
        }
        if (obj.message.month != ''){
            var messagemonth = obj.message.month.replace(/^0+/, '')

            if(messagemonth === '' + parseInt(messagemonth)){
                // is int
                if (messagemonth <=9) {
                    month = '0' + messagemonth;
                }
                else{
                    month = messagemonth;
                }
            }
            else
            {
                adapter.log.error('Could not create alarm as month value is no int! Value: ' + messagemonth);
                erroroccured = true;
    
            }
        }
        if (obj.message.day != ''){
            var messageday = obj.message.day.replace(/^0+/, '')
            if(messageday === '' + parseInt(messageday)){
                // is 
                if (messageday <=9) {
                    day = '0' + messageday;
                }
                else{
                    day = messageday;
                }
            }
            else
            {
                adapter.log.error('Could not create alarm as day value is no int!');
                erroroccured = true;
    
            }
        }
        if (obj.message.hour != ''){
            var messagehour = obj.message.hour.replace(/^0+/, '')

            if(messagehour === '' + parseInt(messagehour)){
                // is int
                if (messagehour <=9) {
                    hour = '0' + messagehour;
                }
                else{
                    hour = messagehour;
                }
            }
            else
            {
                adapter.log.error('Could not create alarm as hour value is no int!');
                erroroccured = true;
    
            }
        }
        if (obj.message.minute != ''){
            var messageminute = obj.message.minute.replace(/^0+/, '')

            if(messageminute === '' + parseInt(messageminute)){
                // is int
                if (messageminute <=9) {
                    minute = '0' + messageminute;
                }
                else{
                    minute = messageminute;
                }
            }
            else
            {
                minute = '00'
            }
        }
    
        if (erroroccured == false){
            var datestring = day + "." + month + "." + year + " " + hour + ":" + minute + ":00";
            adapter.createState('', 'setup', name, {
                read: true, 
                write: true, 
                name: name, 
                type: "string", 
                def: datestring,
                role: 'value'
              });
              adapter.log.info('Created Countdown ' + name + ': ' + datestring);

        }
    }
    else if (countProperties(obj.message) == 1){
        adapter.log.info('Delete countdown: ' +name);
        deleteCountdownSetup(name)
        deleteCountdownResults(name)

    }

    setTimeout(function() {
        // Code, der erst nach 5 Sekunden ausgeführt wird
        loopsetup()
    }, 5000);
}

function createCountdownTable(){

    adapter.setState({ state: 'htmlContent'}, {val: tableify(tableArray), ack: true});

    adapter.setState({ state: 'jsonContent'}, {val: JSON.stringify(tableArray), ack: true});

}


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

      adapter.createState('countdowns', CountName, 'totalWeeks', {
        read: true, 
        write: false, 
        name: "Total No. of Weeks", 
        type: "number", 
        def: 0,
        role: 'value'
      });
      
}

function countProperties(obj) {
    var count = 0;

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
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
