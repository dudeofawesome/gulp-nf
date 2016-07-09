'use strict';

process.on('message', (msg) => {
    process.send('index: ' + msg);
});
