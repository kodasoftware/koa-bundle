import { Context, Middleware } from 'koa';
import Router from '@koa/router';
import compose from 'koa-compose';

export function route(
  name: string,
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  path: string,
  middlewares: Array<Middleware> | Middleware,
  opts: { router?: Router, opts?: Router.RouterOptions } = {},
) {
  const _router = 'router' in opts ? opts.router : new Router(opts.opts);
  if (!(middlewares instanceof Array)) {
    middlewares = [middlewares];
  }
  _router[method](name, path, compose(middlewares));
  return _router;
}
