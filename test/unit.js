const path = require('path');
const { tests } = require('@iobroker/testing');

// Run unit tests - See https://github.com/ioBroker/testing for a detailed explanation and further options

tests.unit(path.join(__dirname, '..'), {

    predefinedObjects: [
        {
            _id: "system.config",
            common: { language: "de" },
            native: { /* ... */ },
            type: 'device'

            
        }
        // ...
    ],

    overwriteAdapterConfig(config) {

        // Ein leeres Array reicht, damit der Wert iterable ist

        config.setup = [];
        /*
        system.config = {
            language: "de"
            
          };
        */
        return config;

    }

});