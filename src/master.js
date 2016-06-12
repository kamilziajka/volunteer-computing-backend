'use strict';

const Master = {};

Master.clients = new Set();

Master.addClient = (client) => {
  Master.clients.add(client);
  Master.emitMetadata();
};

Master.removeClient = (client) => {
  Master.clients.delete(client);
  Master.emitMetadata();
};

Master.emit = (event, data) => {
  Master.clients.forEach((client) => {
    client.emit(event, data);
  });
};

Master.emitMetadata = () => {
  Master.emit('metadata', {
    clients: Master.clients.size
  });
};

Master.splitData = (data) => {
  Master.start = new Date().getTime();
  Master.data = data;
  Master.emitData();

  const hashes = data.items.map(({hash}) => hash);
  const {maxValue} = data;

  const points = [];
  const size = maxValue / Master.clients.size;

  for (let i = 0; i < Master.clients.size; i++) {
    points.push(Math.floor(i * size));
  }

  points.push(maxValue);
  const ranges = [];

  for (let i = 0; i < points.length - 1; i++) {
    ranges.push({
      start: points[i],
      end: points[i + 1]
    })
  }

  [...Master.clients.entries()].forEach(([client], index) => {
    client.emit('compute', {
      range: ranges[index],
      hashes
    });
  });
};

Master.emitData = () => {
  Master.emit('data', Master.data);
};

Master.handleNumber = (number) => {
  const complete = Master.setSuccess(Master.data.items, number);
  Master.emitData();

  if (complete) {
    const time = new Date().getTime() - Master.start;
    Master.emit('complete', time);
  }
};

Master.setSuccess = (items, number) => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].number === number) {
      items[i].success = true;
    }
  }

  return items.reduce((current, {success}) => current && success, true);
};

export default Master;
