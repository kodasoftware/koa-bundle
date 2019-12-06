import logger from 'koa-pino-logger';

export enum LogLevel {
  TRACE = "trace",
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  FATAL = "fatal",
  SILENT = "silent",
}

export enum LogLevelValues {
  TRACE = "10",
  DEBUG = "20",
  INFO = "30",
  WARN = "40",
  ERROR = "50",
  FATAL = "60",
  SILENT = "infinity",
}

export function loggerMiddleware(
  name: string = 'logger',
  level: string = 'error',
  options?: {
    redact?: {
      paths: string[],
      censor?: any,
      remove?: boolean,
    },
    enabled?: boolean,
    prettyPrint?: boolean,
  },
) {
  return logger({ name, level, ...options });
}
