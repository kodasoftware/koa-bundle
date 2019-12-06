import 'should';
import Koa from 'koa';
import request from 'request-promise';
import { middleware } from '../../src';

const { attachCorsMiddleware } = middleware;

describe('Cors middleware', () => {
  const port = 9000;
  const uri = `http://localhost:${port}`;
  let app;
  let server;

  before(() => {
    app = new Koa();
    app.use(attachCorsMiddleware({
      origin: 'http://example.com',
      allowMethods: ['GET'],
    }));
    app.use((ctx) => {
      ctx.res.statusCode = 200;
    });
    server = app.listen(port);
  });
  after(() => server.close());

  it('should return a middleware function', () => {
    const middleware = attachCorsMiddleware();
    middleware.should.be.Function();
  });

  it('should allow cors requests from allowed origin', async () => {
    await request(uri, { method: 'POST', headers: { origin: 'http://origin.com' } }, (err, response) => {
      response.statusCode.should.be.equal(200);
    });
  });
});
