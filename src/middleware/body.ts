import koaBody from 'koa-bodyparser';

export function koaBodyMiddleware(opts?: koaBody.Options) {
  return koaBody(opts);
}