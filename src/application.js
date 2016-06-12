'use strict';

import Koa from 'koa';
import Router from 'koa-router';

const application = new Koa();

const router = new Router();

router.get('/', (ctx, next) => {
  ctx.body = {version: 0.1};
  return next();
});

application.use(router.routes());

export default application;
