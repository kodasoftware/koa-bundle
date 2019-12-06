# Koa Bundle

A bundle of Koa libraries and tools for building Koa APIs. The Koa Bundle provides exports and factory methods for:

- [KoaJS](https://koajs.com)
- [Koa Router](https://github.com/koajs/router)
- [Koa Mount](https://github.com/koajs/mount)
- [Koa Bodyparser](https://github.com/koajs/bodyparser)
- [Koa Cors](https://github.com/koajs/cors)
- [Koa Pino Logger](https://github.com/pinojs/koa-pino-logger)
- [Koa JSON](https://github.com/koajs/json)
- [Swagger JSDoc](https://github.com/Surnet/swagger-jsdoc)
- [Koa Swagger UI](https://github.com/scttcper/koa2-swagger-ui)

There are are also custom middleware that provides:

- Correlation middleware to set a `correlation-id` in the context state and as well as `x-response-time` in miliseconds to the response header.
- Error middleware to handle errors thrown and set response status code and body.
- Request validation middleware (supported by AJV) that will validate request headers, query parameters and body against a provided schema
- Generate swagger docs and UI route to attach as Koa middleware.

## Installation

```
npm add koa-bundle
```

## Example

To set up a basic Koa app with a single route, attach all the bundled middleware and create swagger docs and UI.

```
import { app, middleware, docs, route, mount } from 'koa-bundle';

app.use(middleware.composedMiddlewares({ name: 'example API', level: 'debug' }));
app.use(docs.generateDocsRoute(
  'Example API Docs',
  'get',
  '/docs',
  'Example API Docs',
  '0.0.1',
  'Description of API Docs',
  'localhost:9000',
  '/',
  ['application/json'],
  ['application/json'],
  ['./**/*.ts', './**/*.js],
  [{ name: 'example', description: 'An example tag' }],
  { swaggerOptions: { url: `http://localhost:9000/docs/swagger.json`, deepLinking: true, } },
));

/**
 * @swagger
 * /foo:
 *   tags:
 *     - example
 *   description: Example route
 *   get:
 *     responses:
 *       200:
 *         description: OK
 */
app.use(mount('/foo', route('exampleRoute', '/', 'get', [
  (ctx) => {
    ctx.response.statusCode = 200;
  },
])));

app.listen(9000);
```
