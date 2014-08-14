var socketIo = require('socket.io');

var init = function (server) {
  var io = socketIo(server);

  io.on('connection', function (socket) {
    console.log('a socket with id "' + socket.id + '" has connected');
    
    socket.on('join-chat', function (data) {
      socket.username = data;
      socket.broadcast.emit('user-joined', {
        username: data,
        time: Date.now()
      });
    });
    
    socket.on('disconnect', function () {
      io.sockets.emit('user-left', {
        username: socket.username,
        time: Date.now()
      });
    });
    
    socket.on('leave-chat', function () {
      io.sockets.emit('user-left', {
        username: socket.username,
        time: Date.now()
      });
    });
    
    socket.on('send-message', function (data) {
      io.sockets.emit('message-recieved', {
        username: socket.username,
        time: Date.now(),
        message: data
      });
    });
  });

  return io;
};

module.exports = init;