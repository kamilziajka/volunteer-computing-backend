'use strict';

import IO from 'socket.io';
import Master from './master';

const io = new IO();

io.on('connect', (socket) => {
  Master.addClient(socket);

  socket.on('disconnect', () => {
    Master.removeClient(socket);
  });

  socket.on('data', (data) => {
    Master.splitData(data);
  });

  socket.on('number', (number) => {
    Master.handleNumber(number);
  });
});

export default io;
