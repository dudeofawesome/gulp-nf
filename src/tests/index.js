'use strict';

process.on('message', (mes) => {
    process.send({mes});
});
