import socketIO from 'socket.io';

function sockets(server) {
  const io = socketIO(server);

  // Socket.IO Connection logic
  io.on('connection', (socket) => {
    socket.on('disconnect', () => {

    });

    socket.on('chat message', (message) => {
      let session = socket.request.session;
      if (session.messages) {
        session.messages++;
      } else {
        session.messages = 1;
      }
      session.save();

      let name = session.fb.name || socket.id;

      io.emit('chat message',`[${session.messages}] ${name}: ${message}`);
    });
  });

  return io;
}

export default sockets;
