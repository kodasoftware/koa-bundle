import Router from '@koa/router';
import compose from 'koa-compose';

export function route(name, method, path, middlewares, opts: any = {}) {
  const router = 'router' in opts ? opts.router : new Router(opts);
  if (!(middlewares instanceof Array)) {
    middlewares = [middlewares];
  }
  router[method](name, path, compose(middlewares));
  return router;
}
