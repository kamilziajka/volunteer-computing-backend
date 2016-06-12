'use strict';

import config from 'config';
import server from './server';
import io from './io';

io.attach(server);

const {port} = config.get('http');

server.listen(port, () => {
  console.log(`server up on port ${port}`);
});
