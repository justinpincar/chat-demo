var express = require('express');

var app = express.createServer();
app.listen(3000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var io = require('socket.io').listen(app);
var chat = io.sockets.on('connection', function (socket) {
  socket.emit('chat', {msg: "Type a message to others online! No history is stored in this version.", nickname: "System"});
  socket.on('chat', function (data) {
    chat.emit('chat', data);
  });
});

app.configure('development', function(){
  app.use(express.directory(__dirname + '/public'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

