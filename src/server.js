'use strict';

import http from 'http';
import application from './application';

const server = http.createServer(application.callback());

export default server;
