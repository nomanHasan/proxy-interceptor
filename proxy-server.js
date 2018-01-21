const http = require('http');
const net = require('net');
const url = require('url');
const axios = require('axios');
const request = require('request');

// Create an HTTP tunneling proxy
const proxy = http.createServer((client_req, client_res) => {
    console.log('serve: ' + client_req.url);

    var options = {
        hostname: 'www.google.com',
        port: 80,
        path: client_req.url,
        method: 'GET'
    };

    console.log(client_req.url);

    var proxy = http.request(options, function (res) {
        res.pipe(client_res, {
            end: true
        });
    });

    client_req.pipe(proxy, {
        end: true
    });

});

var port = 5000;

proxy.listen(port);
proxy.on('error', onError);
proxy.on('listening', onListening);



function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}


function onListening() {
    var addr = proxy.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}