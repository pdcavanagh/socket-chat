var fs = require('fs');
var http = require('http');

/* https setup */
// var https = require('https');
// var privateKey  = fs.readFileSync('ssl/ssl.key', 'utf8');
// var certificate = fs.readFileSync('ssl/ssl.crt', 'utf8');
// var credentials = {key: privateKey, cert: certificate};

var express = require('express');
var app = express();

var server = http.Server(app);
var port = 3000;
var io = require('socket.io')(server);

/* https server */
//var httpsServer = https.Server(credentials, app);
//var io = require('socket.io')(httpsServer);

/* Generate a v4 UUID (random) */
const uuidV1 = require('uuid/v1');

/* Serve the files in the '/public' folder */
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {  
    res.sendFile(__dirname + '/index.html');
});

/* Websockets (using socket.io) configuration and functionality */
io.on('connection', function(socket) {
    var clients = [];
    var userId = '';

    clients.push(socket);

    socket.on('disconnect', function() {
        var user = socket.id;
        clients.splice(clients.indexOf(socket), 1);
        io.emit('announcements', { name: userId, time: Date.now(), message: userId + ' has left.' });
    });

    // Receive join announcement from client
    socket.on('join', function(data) {
        userId = data.userId;
        console.log(data.userId + ' has joined the chat.');
        io.sockets.emit('announcements', { name: data.userId, time: data.time, message: data.userId + ' has joined!' });
    });

    // Receive messages from client
    socket.on('message', function(data) {
        console.log(data);
        console.log('Client message:', data.message);
        io.sockets.emit('announcements', { 
            name: data.userId,
            time: data.time,
            message: data.message 
        });
    });
});

server.listen(port, function () {
    console.log('Server running at port: ' + port);
});

/* https server */
// var port = 8843;
// httpsServer.listen(port, function () {
//     console.log('Secure server running at port: ' + port);
// });
