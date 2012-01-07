//require("request");
var io = require('socket.io').listen(process.env.C9_PORT);

console.log(process.env);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});