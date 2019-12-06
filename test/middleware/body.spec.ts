import 'should';
import Koa from 'koa';
import request from 'request-promise';
import td from 'testdouble';
import { middleware } from '../../src';

const { koaBodyMiddleware } = middleware;

describe('Body middleware', () => {
  const port = 9000;
  const uri = `http://localhost:${port}`;
  const command = td.function('command');
  let app;
  let server;

  before(() => {
    app = new Koa();
    app.use(koaBodyMiddleware());
    app.use((ctx) => {
      command(ctx.request.body);
      ctx.res.statusCode = 200;
    });
    server = app.listen(port);
  });
  afterEach(() => td.reset());
  after(() => server.close());

  it('should return a middleware function', () => {
    const middleware = koaBodyMiddleware();
    middleware.should.be.Function();
  });

  it('should parse a request body', async () => {
    const body = { foo: 'bar' };
    td.when(command(), { ignoreExtraArgs: true }).thenDo((_body) => { _body.should.be.eql(body); })
    await request(uri, { method: 'POST', body, json: true });
  });
});
