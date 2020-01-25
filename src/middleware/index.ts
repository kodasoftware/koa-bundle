import compose from 'koa-compose';
import koaBody from 'koa-body';
import { koaBodyMiddleware } from './body';
import { correlationMiddleware } from './correlation';
import { loggerMiddleware, LogLevel, LogLevelValues } from './logger';
import { requestValidationForSchema } from './requestValidation';
import { prettyJsonMiddleware } from './prettyJson';
import { errorMiddleware } from './error';
import { attachCorsMiddleware } from './cors';

export function composedMiddlewares(
  name: string,
  level: LogLevel,
  schema?: any,
  opts?: {
    body?: koaBody.IKoaBodyOptions & koaBody.IKoaBodyFormidableOptions,
    logger?: {
      redact?: {
        paths: string[],
        censor?: any,
        remove?: boolean,
      },
      enabled?: boolean,
      prettyPrint?: boolean,
    },
    schema?: {
      removeAdditional?: boolean,
      useDefaults?: boolean,
      coerceTypes?: boolean,
    },
    cors?: { [key: string]: any },
  },
) {
  const middlewares = [
    prettyJsonMiddleware(),
    loggerMiddleware(name, level, opts && opts.logger),
    errorMiddleware,
    correlationMiddleware,
    attachCorsMiddleware(opts && opts.cors),
    koaBodyMiddleware(opts && opts.body),
  ];
  if (schema) middlewares.push(requestValidationForSchema(schema, opts.schema));
  return compose(middlewares);
};

export {
  koaBodyMiddleware,
  correlationMiddleware,
  errorMiddleware,
  loggerMiddleware, LogLevel, LogLevelValues,
  requestValidationForSchema,
  attachCorsMiddleware,
};
