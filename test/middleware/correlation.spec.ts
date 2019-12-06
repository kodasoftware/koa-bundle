import 'should';
import Koa from 'koa';
import request from 'request-promise';
import td from 'testdouble';
import uuid from 'uuid-random';
import { middleware } from '../../src';

const { correlationMiddleware } = middleware;

describe('Correlation middleware', () => {
  const port = 9000;
  const uri = `http://localhost:${port}`;
  const correlation = td.function('correlation');
  let app;
  let server;

  before(() => {
    app = new Koa();
    app.use(correlationMiddleware);
    app.use((ctx) => {
      correlation(ctx.state);
      ctx.res.statusCode = 200;
    });
    server = app.listen(port);
  });
  afterEach(() => td.reset())
  after(() => server.close());

  it('should return a middleware function', () => {
    const middleware = correlationMiddleware;
    middleware.should.be.Function();
  });

  it('should generate a correlation id for a request', async () => {
    td.when(correlation(), { ignoreExtraArgs: true }).thenDo((state) => {
      state.should.have.properties('correlationId');
    });
    await request(uri, { method: 'GET' }, (err, response) => {
      response.headers.should.have.properties(['x-response-time', 'correlation-id']);
      response.headers['x-response-time'].should.endWith('ms');
      response.headers['correlation-id'].should.be.String();
    });
  });

  it('should pass inherited correlation id to request', async () => {
    const correlationId = uuid();
    td.when(correlation(), { ignoreExtraArgs: true }).thenDo((state) => {
      state.should.have.property('correlationId', correlationId);
    });
    await request(uri, { method: 'GET', headers: { 'correlation-id': correlationId } }, (err, response) => {
      response.headers.should.have.properties(['x-response-time', 'correlation-id']);
      response.headers['correlation-id'].should.be.equal(correlationId);
    });
  });
});
