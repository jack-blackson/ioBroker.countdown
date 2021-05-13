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
var Interval

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

function startAdapter(options) {

    options = options || {};
    Object.assign(options, {
        name: 'countdown',
        ready: function() {
            Interval = setInterval(function() { 
                // alle 1 Minute ausführen 
                main(); 
            }, 60000); 
            main()
        }
    });

    AdapterStarted = false;

    adapter = new utils.Adapter(options);

    adapter.on('message', obj => {
        //adapter.log.debug('received message!');
    
        if (obj && obj.command === 'send') {
            adapter.log.debug('received send command!');
            processMessage(obj);
        }
        
    });
    
    adapter.on(`unload`, callback => {
        //adapter.log.info(`Stopping countdown adapter!`);
        clearInterval(Interval);
        callback && callback();
    });


    return adapter;

}



function main() {
    if (AdapterStarted == false){
        
        getVariableTranslation()
        AdapterStarted = true
    }

    loopsetup()

    cleanresults()

}

function cleanresults(CountName){
    adapter.log.debug('Start Clean results')

    // clean results when a setup is deleted
    if(CountName == null){
        // function started without parameter from normal loop
        adapter.getChannelsOf('countdowns', function (err, result) {
            for (const channel of result) {
                adapter.log.debug('checking countdown "' + channel.common.name)
                adapter.getObject('setup.' + channel.common.name, function (err, state) {
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
    adapter.deleteChannel('countdowns',CountName);
}

function deleteCountdownSetup(CountName){
    adapter.deleteState('setup','',CountName);
}


function loopsetup(){
    //adapter.log.debug('Start Loop Setup')

    tableArray = [];

    adapter.getStatesOf("setup", function(error, result) {
        for (const id1 of result) {
            //adapter.log.debug('Setup Entries found: ' + id1.common.name )

            adapter.getState('setup.' + id1.common.name, function (err, state) {
                //prüfen ob Device schon vorhanden ist
                adapter.getObject('countdowns.' + id1.common.name + '.name', async function (err1, result1) {

                    if(result1 === null && typeof result1 === "object") {
                        const CountName = id1.common.name
                        const done = await createObjects(CountName)
                        adapter.getState('setup.' + CountName, function (err, state) {
                            //adapter.log.debug('Object created')

                            createCountdownData(CountName, state.val)
                             adapter.log.info('Created Countdown ' + CountName);
                           });
                    }
                    else{
                        createCountdownData(id1.common.name,state.val)
                    }
                });
            });

        }
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
            case 'ru':
                textYear = 'Год';
                textYears = 'лет';
                textYearsShort = 'Y';
                textMonth = 'месяц';
                textMonths = 'месяцы';
                textMonthsShort = 'M'
                textDay = 'день';
                textDays = 'дней';
                textDaysShort = 'D';
                textHour = 'час';
                textHours = 'часов';
                textHoursShort = 'H';
                textMinute = 'минут';
                textMinutes = 'минут';         
                textMinutesShort = 'M';
                break;
            case 'pt':
                textYear = 'ano';
                textYears = 'anos';
                textYearsShort = 'A';
                textMonth = 'mês';
                textMonths = 'meses';
                textMonthsShort = 'M'
                textDay = 'dia';
                textDays = 'dias';
                textDaysShort = 'D';
                textHour = 'hora';
                textHours = 'horas';
                textHoursShort = 'H';
                textMinute = 'minuto';
                textMinutes = 'minutos';         
                textMinutesShort = 'M';
                break;
            case 'nl':
                textYear = 'jaar';
                textYears = 'jaar';
                textYearsShort = 'J';
                textMonth = 'maand';
                textMonths = 'maanden';
                textMonthsShort = 'M'
                textDay = 'dag';
                textDays = 'dagen';
                textDaysShort = 'D';
                textHour = 'uur';
                textHours = 'uur';
                textHoursShort = 'H';
                textMinute = 'minuut';
                textMinutes = 'notulen';         
                textMinutesShort = 'M';
                break;
            case 'fr':
                textYear = 'année';
                textYears = 'années';
                textYearsShort = 'A';
                textMonth = 'mois';
                textMonths = 'mois';
                textMonthsShort = 'M'
                textDay = 'journée';
                textDays = 'journées';
                textDaysShort = 'J';
                textHour = 'heure';
                textHours = 'heures';
                textHoursShort = 'H';
                textMinute = 'minute';
                textMinutes = 'minutes';         
                textMinutesShort = 'M';
                break;
            case 'it':
                textYear = 'anno';
                textYears = 'anni';
                textYearsShort = 'A';
                textMonth = 'mese';
                textMonths = 'mesi';
                textMonthsShort = 'M'
                textDay = 'giorno';
                textDays = 'giorni';
                textDaysShort = 'G';
                textHour = 'ora';
                textHours = 'ore';
                textHoursShort = 'O';
                textMinute = 'minuto';
                textMinutes = 'minuti';         
                textMinutesShort = 'M';
                break;
            case 'es':
                textYear = 'año';
                textYears = 'años';
                textYearsShort = 'A';
                textMonth = 'mes';
                textMonths = 'meses';
                textMonthsShort = 'M'
                textDay = 'día';
                textDays = 'dias';
                textDaysShort = 'D';
                textHour = 'hora';
                textHours = 'horas';
                textHoursShort = 'H';
                textMinute = 'minuto';
                textMinutes = 'minutos';         
                textMinutesShort = 'M';
                break;
            case 'pl':
                textYear = 'rok';
                textYears = 'lat';
                textYearsShort = 'R';
                textMonth = 'miesiąc';
                textMonths = 'miesięcy';
                textMonthsShort = 'M'
                textDay = 'dzień';
                textDays = 'dni';
                textDaysShort = 'D';
                textHour = 'godzina';
                textHours = 'godziny';
                textHoursShort = 'G';
                textMinute = 'minuta';
                textMinutes = 'minuty';         
                textMinutesShort = 'M';
                break;
            case 'zh-cn':
                textYear = '年';
                textYears = '年份';
                textYearsShort = 'Y';
                textMonth = '月';
                textMonths = '个月';
                textMonthsShort = 'M'
                textDay = '天';
                textDays = '天';
                textDaysShort = 'D';
                textHour = '小时';
                textHours = '小时';
                textHoursShort = 'H';
                textMinute = '分钟';
                textMinutes = '分钟';         
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
    var repeatCycle = ''
    // check if a "repeat cycle" was added
    let SearchForCycle = CountDate.indexOf('+')
    if (SearchForCycle != -1){
        repeatCycle = CountDate.slice((SearchForCycle+1), CountDate.length)
        CountDate = CountDate.slice(0,SearchForCycle)
    }
    //adapter.log.debug('Repeat Cycle for ' + CountName + ' is: ' +  repeatCycle)

    var newdate = moment(CountDate, 'DD.MM.YYYY HH:mm:ss').toDate();

    switch (adapter.config.dateFormat) {
        case "EuropeDot": var newdatelocal = moment(newdate).local().format('DD.MM.YYYY HH:mm');
                        break;
        case "EuropeMinus": var newdatelocal = moment(newdate).local().format('DD-MM-YYYY HH:mm');
                            break;
        case "USDot"  : var newdatelocal = moment(newdate).local().format('MM.DD.YYYY HH:MM');
                        break;
        case "USMinuts"   : var newdatelocal = moment(newdate).local().format('MM-DD-YYYY HH:MM');
                        break;
        case "YearFirst"   : var newdatelocal = moment(newdate).local().format('YYYY-MM-DD HH:mm');
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

    var storagename = CountName
    adapter.setState({device: 'countdowns' , channel: storagename, state: 'name'}, {val: CountName, ack: true});
    adapter.setState({device: 'countdowns' , channel: storagename, state: 'endDate'}, {val: newdatelocal, ack: true});

    if (now.diff(newdate) >= 0){
        if (repeatCycle != ''){
            // calculate new end date and write it into setup - countdown will then be updated in the next update cycle

            // check if repeat cycle contains a number

            if (hasNumber(repeatCycle)){
                var repeatNumber = Number(repeatCycle.match(/\d+/g).map(Number))
                if (repeatNumber != null){
                    var repeatType = repeatCycle.slice(repeatNumber.toString().length, repeatCycle.length);
                    if (repeatType != '') {
                        var newDateRepeat = newdate

                        switch (repeatType) {
                            case "Y": 
                                            newDateRepeat = new Date(newdate.getFullYear() + repeatNumber, newdate.getMonth(), newdate.getDate(), newdate.getHours(), newdate.getMinutes())
                                            break;
                            case "M": 
                                            newDateRepeat = new Date(newdate.getFullYear(), newdate.getMonth() + repeatNumber, newdate.getDate(), newdate.getHours(), newdate.getMinutes())
                                            break;
                            case "D"  : 
                                            newDateRepeat = new Date(newdate.getFullYear(), newdate.getMonth(), newdate.getDate()+ repeatNumber, newdate.getHours(), newdate.getMinutes())
                                            break;
                            case "H"   : 
                                            newDateRepeat = new Date(newdate.getFullYear(), newdate.getMonth(), newdate.getDate(), newdate.getHours()+ repeatNumber, newdate.getMinutes())
                                            break;
                            case "m"   : 
                                            newDateRepeat = new Date(newdate.getFullYear(), newdate.getMonth(), newdate.getDate(), newdate.getHours(), newdate.getMinutes()+ repeatNumber)
                                            break;
                            default: adapter.log.error('Repeat Cycle ' + repeatCycle + ' is invalid!')
                            ;
                        }
                        let newDateString = moment(newDateRepeat).format('DD') + '.' + moment(newDateRepeat).format('MM') + '.' + 
                        moment(newDateRepeat).format('YYYY') + ' ' + moment(newDateRepeat).format('HH') + ':' + 
                        moment(newDateRepeat).format('mm') + ':00' + '+' + repeatCycle
                        adapter.setState({device: 'setup' , state: storagename}, {val: newDateString, ack: true});

                    }
                    else{
                        adapter.log.error('Repeat Cycle ' + repeatCycle + ' is invalid!')
                    }   
                }
                else{
                    adapter.log.error('Repeat Cycle ' + repeatCycle + ' is invalid!')
                }
            }
            else{
            adapter.log.error("Repeat cycle " + repeatCycle + " is invalid - Layout is e.g. 1M for 1 month.")
            }
        }
        else{
            // Countdown reached now -> disable countdown 
            adapter.setState({device: 'countdowns' , channel: storagename, state: 'years'}, {val: 0, ack: true});
            adapter.setState({device: 'countdowns' , channel: storagename, state: 'months'}, {val: 0, ack: true});
            adapter.setState({device: 'countdowns' , channel: storagename, state: 'days'}, {val: 0, ack: true});
            adapter.setState({device: 'countdowns' , channel: storagename, state: 'hours'}, {val: 0, ack: true});
            adapter.setState({device: 'countdowns' , channel: storagename, state: 'minutes'}, {val: 0, ack: true});
            adapter.setState({device: 'countdowns' , channel: storagename, state: 'inWordsShort'}, {val: '', ack: true});
            adapter.setState({device: 'countdowns' , channel: storagename, state: 'inWordsLong'}, {val: '', ack: true});
            adapter.setState({device: 'countdowns' , channel: storagename, state: 'reached'}, {val: true, ack: true});
            adapter.setState({device: 'countdowns' , channel: storagename, state: 'repeatEvery'}, {val: '', ack: true});


            if (adapter.config.autodelete){
                deleteCountdownSetup(CountName)
                deleteCountdownResults(CountName)
            }
        }
    }
    else{
        // Countdown not reached -> update values

        var CountDowninWordsShort = '';
        var CountDowninWordsLong = '';

        //years
        if (years != 0){
            if (years > 1){
                CountDowninWordsLong = years+' ' +  textYears;
                CountDowninWordsShort = years+ textYearsShort;
            }
            else if (years = 1){
                CountDowninWordsLong = years+' ' +  textYear;
                CountDowninWordsShort = years+ textYearsShort;
            }
        }

        //months
        if (months != 0 || years != 0){

            if (months > 1){
                CountDowninWordsLong += ' ' + months+ ' ' + textMonths;
                CountDowninWordsShort += ' ' + months+textMonthsShort;
            }
            else if (months = 1) {
                CountDowninWordsLong += ' ' + months+ ' ' + textMonth;
                CountDowninWordsShort += ' ' + months+textMonthsShort;
            }
        }

        //days
        if (days != 0 || months != 0 || years != 0){

            if (days > 1){
                CountDowninWordsLong += ' ' + days+ ' ' + textDays;
                CountDowninWordsShort += ' ' + days+textDaysShort;
            }
            else if (days = 1) {
                CountDowninWordsLong += ' ' + days+ ' ' + textDay;
                CountDowninWordsShort += ' ' + days+textDaysShort;
            }
        }

        //hours
        if (hours != 0 && years == 0 && months == 0){
            if (hours > 1){
                CountDowninWordsLong += ' ' + hours+ ' ' + textHours;
                CountDowninWordsShort += ' ' + hours+textHoursShort;
            }
            else if (hours = 1){
                CountDowninWordsLong += ' ' + hours+' ' + textHour;
                CountDowninWordsShort += ' ' + hours+textHoursShort;
            } 
        }

        //minutes
        if (years == 0 && months == 0){
            CountDowninWordsShort += ' ' + minutes+textMinutesShort;
            if (minutes > 1){
                CountDowninWordsLong += ' ' + minutes+ ' ' + textMinutes;
            }
            else {
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
        adapter.setState({device: 'countdowns' , channel: storagename, state: 'repeatEvery'}, {val: repeatCycle, ack: true});   


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

        createCountdownTable()

    }
}

function hasNumber(myString) {
    // function to check if string contains a number
    return /\d/.test(myString);
  }
  

async function processMessage(obj){
    var year = 0
    var month = '0'
    var day = '0'
    var hour = '01'
    var minute = '01'
    var name = obj.message.name
    var erroroccured = false

    if (typeof obj.message.date != 'undefined'){
        var repeatCycle = ''
        if (obj.message.date != ''){ 
            var processingDate = obj.message.date
            // check if a "repeat cycle" was added
            let SearchForCycle = obj.message.date.indexOf('+')
            if (SearchForCycle != -1){
                repeatCycle = obj.message.date.slice((SearchForCycle), obj.message.date.length)
                processingDate = processingDate.slice(0,SearchForCycle)
            }


            switch (adapter.config.dateFormat) {
                case "EuropeDot": 
                                var messageDate = moment(processingDate, 'DD.MM.YYYY HH:mm').toDate();
                                break;
                case "EuropeMinus": 
                                 var messageDate = moment(processingDate, 'DD-MM-YYYY HH:mm').toDate();
                                break;
                case "USDot"  : 
                                var messageDate = moment(processingDate, 'MM.DD.YYYY HH:MM').toDate();
                                break;
                case "USMinuts"   : 
                                var messageDate = moment(processingDate, 'MM-DD-YYYY HH:MM').toDate();
                                break;
                case "YearFirst"   : 
                                var messageDate = moment(processingDate, 'YYYY-MM-DD HH:mm').toDate();
                                break;
                default: var messageDate = moment(processingDate, 'DD.MM.YYYY HH:mm').toDate();
                ;
            }

            var messageDateString = moment(messageDate).format('DD') + '.' + moment(messageDate).format('MM') + '.' + 
                                    moment(messageDate).format('YYYY') + ' ' + moment(messageDate).format('HH') + ':' + 
                                    moment(messageDate).format('mm') + ':00'
             
            if (moment(messageDateString, 'DD.MM.YYYY HH:mm:ss',true).isValid()) {
                messageDateString += repeatCycle
                const done = await createSetupEntryCompleteDate(messageDateString,name);
                loopsetup();

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
    
            const done = await createSetupEntryCompleteDate(messageDateString,name);
            loopsetup();
        
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
    
            const done = await createSetupEntryCompleteDate(messageDateString,name);
            loopsetup();
            
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
    
            const done = await createSetupEntryCompleteDate(messageDateString,name);
            loopsetup();                      
    
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

            const done = await createSetupEntryCompleteDate(messageDateString,name);
            loopsetup();
            
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

            const done = await createSetupEntryCompleteDate(messageDateString,name);
            loopsetup();

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
                hour = '00';
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
            const done = await createSetupEntry(day,month,year,hour,minute,name);
            loopsetup();
            
    }
    else if (countProperties(obj.message) == 1){
        adapter.log.info('Delete countdown: ' +name);
        deleteCountdownSetup(name)
        deleteCountdownResults(name)

        }
    }   
}

async function createSetupEntry(day,month,year,hour,minute,name){
    var datestring = day + "." + month + "." + year + " " + hour + ":" + minute + ":00";

    const obj_new = await adapter.getObjectAsync('setup.' + name);
    if (obj_new != null) {
        const promises = await adapter.setStateAsync({device: 'setup', state: name}, {val: datestring, ack: true});
        adapter.log.debug('Setup Entry updated')
    } 
    else {
        const promises = await adapter.createStateAsync('', 'setup', name, {
            read: true, 
            write: true, 
            name: name, 
            type: "string", 
            def: datestring,
            role: 'value'
          })
          adapter.log.debug('Setup Entry created')
    }
    
}

async function createSetupEntryCompleteDate(messageDateString,name){
    const obj_new = await adapter.getObjectAsync('setup.' + name);
    if (obj_new != null) {
        const promises = await adapter.setStateAsync({device: 'setup', state: name}, {val: messageDateString, ack: true});
        adapter.log.debug('Setup Entry updated')
    } 
    else {

    const promises = await adapter.createStateAsync('', 'setup', name, {
        read: true, 
        write: true, 
        name: name, 
        type: "string", 
        def: messageDateString,
        role: 'value'
    
        });
        adapter.log.debug('Setup Entry created')
    }
}

function createCountdownTable(){

    adapter.setState({ state: 'htmlContent'}, {val: tableify(tableArray), ack: true});

    adapter.setState({ state: 'jsonContent'}, {val: JSON.stringify(tableArray), ack: true});

}


async function createObjects(CountName){
    //adapter.log.debug('Start creating Objects')
    const promises = await Promise.all([

    adapter.setObjectNotExistsAsync('countdowns.' + CountName, {
            common: {
                  name: CountName
            },
            type: 'channel',
            'native' : {}
    }),

    adapter.createStateAsync('countdowns', CountName, 'name', { 
            read: true, 
            write: true, 
            name: "Name", 
            type: 'string', 
            def: CountName,
            role: 'value'
    }),
    

    adapter.createStateAsync('countdowns', CountName, 'reached', {
            read: true, 
            write: true, 
            name: "Reached", 
            type: "boolean", 
            def: false,
            role: 'value'
    }),

    adapter.createStateAsync('countdowns', CountName, 'years', {
            read: true, 
            write: true, 
            name: "Years", 
            type: "number", 
            def: 0,
            role: 'value'
		
    }),

    adapter.createStateAsync('countdowns', CountName, 'months', {
        read: true, 
        write: true, 
        name: "Months", 
        type: "number", 
        def: 0,
        role: 'value'
      }),

      adapter.createStateAsync('countdowns', CountName, 'days', {
        read: true, 
        write: true, 
        name: "Days", 
        type: "number", 
        def: 0,
        role: 'value'
      }),

      adapter.createStateAsync('countdowns', CountName, 'hours', {
        read: true, 
        write: true, 
        name: "Hours", 
        type: "number", 
        def: 0,
        role: 'value'
      }),

      adapter.createStateAsync('countdowns', CountName, 'minutes', {
        read: true, 
        write: true, 
        name: "Minutes", 
        type: "number", 
        def: 0,
        role: 'value'
      }),

      adapter.createStateAsync('countdowns', CountName, 'inWordsLong', {
        read: true, 
        write: true, 
        name: "Result in Words Long", 
        type: "string", 
        def: '',
        role: 'value'
      }),

     adapter.createStateAsync('countdowns', CountName, 'inWordsShort', {
        read: true, 
        write: true, 
        name: "Result in Words Short", 
        type: "string", 
        def: '',
        role: 'value'
      }),

      adapter.createStateAsync('countdowns', CountName, 'endDate', {
        read: true, 
        write: true, 
        name: "Enddate", 
        type: "string", 
        def: '',
        role: 'value'
      }),

      adapter.createStateAsync('countdowns', CountName, 'totalDays', {
        read: true, 
        write: true, 
        name: "Total No. of Days", 
        type: "number", 
        def: 0,
        role: 'value'
      }),

      adapter.createStateAsync('countdowns', CountName, 'totalHours', {
        read: true, 
        write: true, 
        name: "Total No. of Hours", 
        type: "number", 
        def: 0,
        role: 'value'
      }),

      adapter.createStateAsync('countdowns', CountName, 'totalWeeks', {
        read: true, 
        write: true, 
        name: "Total No. of Weeks", 
        type: "number", 
        def: 0,
        role: 'value'
      }),

      adapter.createStateAsync('countdowns', CountName, 'repeatEvery', {
        read: true, 
        write: true, 
        name: "Period when the Countdown should be repeated", 
        type: "string", 
        def: '',
        role: 'value'
      })

    ])
      //adapter.log.info('all states created')

      
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

// If started as allInOne/compact mode => return function to create instance
if (module && module.parent) {
    module.exports = startAdapter;
} else {
    // or start the instance directly
    startAdapter();
} 
