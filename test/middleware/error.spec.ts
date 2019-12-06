import 'should';
import Koa from 'koa';
import request from 'request-promise';
import { middleware } from '../../src';

const { errorMiddleware } = middleware;

describe('Error middleware', () => {
  const port = 9000;
  const uri = `http://localhost:${port}`;
  let app;
  let server;

  before(() => {
    app = new Koa();
    app.use(errorMiddleware);
    app.use((ctx) => {
      ctx.throw(500, 'Custom Error Message');
    });
    server = app.listen(port);
  });
  after(() => server.close());

  it('should return a middleware function', () => {
    const middleware = errorMiddleware;
    middleware.should.be.Function();
  });
  
  it('should catch errors thrown', async () => {
    await request(uri, { method: 'GET' }).catch((err) => {
      err.message.should.be.equal('500 - "Custom Error Message"');
      err.statusCode.should.be.equal(500);
    });
  });
});
