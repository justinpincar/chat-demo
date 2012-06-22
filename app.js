var express = require('express');

var app = express.createServer();
app.listen(3000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var io = require('socket.io').listen(app);
var chat = io.sockets.on('connection', function (socket) {
  var room = null;
  socket.on('join_room', function(data) {
    nickname = data.nickname;
    room = data.room;
    socket.join(room);
    io.sockets.in(room).emit('chat', {msg: nickname + ' joined the room.', nickname: "System"});
  });
  socket.on('chat', function (data) {
    io.sockets.in(room).emit('chat', data);
  });
  socket.on('disconnect', function(data){
    io.sockets.in(room).emit('chat', {msg: nickname + ' left the room.', nickname: "System"});
  });
});

app.configure('development', function(){
  app.use(express.directory(__dirname + '/public'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

