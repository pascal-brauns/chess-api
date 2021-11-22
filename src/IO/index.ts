import { Server } from 'socket.io';

const io = new Server();

io.on('connection', socket => {
  socket;
});

export default io;