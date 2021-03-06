import Ajv from 'ajv';
import { Context } from 'koa';

const UPDATE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

export function requestValidationForSchema(
  schema: any,
  opts: {
    removeAdditional?: boolean,
    useDefaults?: boolean,
    coerceTypes?: boolean,
    allErrors?: boolean,
    [key: string]: any,
  } = { removeAdditional: true, useDefaults: true, coerceTypes: true, allErrors: true, },
) {
  const ajv = new Ajv(opts);
  const validate = ajv.compile(schema);
  return async function requestValidationMiddlewate(ctx: Context, next) {
    let data = ctx.query;
    if (UPDATE_METHODS.includes(ctx.method)) {
      if (ctx.is('multipart')) data = { ...data, ...ctx.request.body, ...ctx.request.files };
      else data = { ...data, ...ctx.request.body };
    }
    if (!await validate(data)) {
      ctx.throw(400, validate.errors);
    }
    return next();
  }
}
