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
const adapter = new utils.Adapter('countdown');

let adapter;

function startAdapter(options) {
    adapter.log.info('start adapter');

    options = options || {};
    Object.assign(options, {
      name: 'hs100',
      
      stateChange: function (id, state) {
          setDevState(id, state); 
      },
        
      ready: function () {
        main();
      },
      
      unload: function (callback) {
        if (timer) {
          clearInterval(timer);
          timer = 0;
        }
        isStopping = true;
        callback && callback();
      },
         
      objectChange: function (id, obj) {
         adapter.log.info('objectChange ' + id + ' ' + JSON.stringify(obj));
      }     
    });
    adapter = new utils.Adapter(options);
    
    return adapter;
};

function stop() {
    adapter.log.info('stop adapter');

    if (stopTimer) clearTimeout(stopTimer);

    // Stop only if schedule mode
    if (adapter.common && adapter.common.mode == 'schedule') {
        stopTimer = setTimeout(function () {
            stopTimer = null;
            if (timer) clearInterval(timer);
            isStopping = true;
            adapter.stop();
        }, 30000);
    }
}

// Load your modules here, e.g.:
// const fs = require("fs");

function main() {
    //host = adapter.host;
    adapter.log.info('No one IP configured');

    //adapter.log.debug('Host = ' + host);

    if (!adapter.config.countdown.length) {
        adapter.log.info('No one IP configured');
        stop();
        return;
    }

    adapter.config.interval = parseInt(adapter.config.interval, 10);

// polling min 5 sec.
    if (adapter.config.interval < 5000) {
        adapter.config.interval = 5000;
    }

    adapter.subscribeStates('*');
}