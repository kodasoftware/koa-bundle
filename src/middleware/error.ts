export function errorMiddleware(ctx, next) {
  const { NODE_ENV = 'development' } = process.env;

  return next().catch((err) => {
    const status = err.status || 500;
    err.expose = NODE_ENV === 'development';
    
    if (ctx.log) ctx.log.error(err);

    ctx.res.statusCode = status;
    ctx.response.status = status;
    ctx.body = err.message || 'Internal Server Error';
  });
}
