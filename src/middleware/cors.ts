import cors from '@koa/cors';
import { Middleware } from 'koa';

export function attachCorsMiddleware(options?: {
  origin?: string|Middleware,
  allowMethods?: string[]|string,
  exposeHeaders?: string[]|string,
  allowHeaders?: string[]|string,
  maxAge?: string|number,
  credentials?: boolean,
  keepHeadersOnError?: boolean,
}) {
  return cors(options);
}
