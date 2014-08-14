var socketIo = require('socket.io');

var init = function (server) {
  var io = socketIo(server);

  io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
  });

  return io;
};

module.exports = init;