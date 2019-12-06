import json from 'koa-json';

export function prettyJsonMiddleware(
  opts: { pretty: boolean, param?: string, spaces?: number } = { pretty: true },
) {
  return json(opts);
}
