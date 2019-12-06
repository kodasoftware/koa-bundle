import uuid from 'uuid-random';

export async function correlationMiddleware(ctx, next) {
  const start = Date.now();
  ctx.state.correlationId = ctx.req.headers['correlation-id'] || uuid();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  ctx.set('correlation-id', ctx.state.correlationId);
}
