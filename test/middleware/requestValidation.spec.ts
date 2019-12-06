import 'should';
import Koa from 'koa';
import request from 'request-promise';
import td from 'testdouble';
import { stringify } from 'querystring';
import { middleware } from '../../src';

const { koaBodyMiddleware, requestValidationForSchema } = middleware;

describe('Request validation middleware', () => {
  const port = 9000;
  const uri = `http://localhost:${port}`;
  const schema = {
    type: 'object',
    properties: {
      foo: { type: 'string', enum: ['bar'] },
      example: { type: 'integer', min: 0, default: 1 },
    },
    required: ['foo'],
  };
  const validate = td.function('validate');
  let app;
  let server;

  before(() => {
    app = new Koa();
    app.use(koaBodyMiddleware());
    app.use(requestValidationForSchema(schema));
    app.use((ctx) => {
      validate({ ...ctx.request.body, ...ctx.query });
      ctx.res.statusCode = 200;
    });
    server = app.listen(port);
  });
  after(() => server.close());
  afterEach(() => td.reset());

  it('should return a middleware function', () => {
    const middleware = requestValidationForSchema(schema);
    middleware.should.be.Function();
  });

  it('should validate a valid payload', async () => {
    const body = { foo: 'bar', example: 3 };
    td.when(validate(), { ignoreExtraArgs: true }).thenDo((_body) => {
      _body.should.be.eql(body);
    });
    await request(uri, { method: 'POST', body, json: true }, (err, response) => {
      response.statusCode.should.be.equal(200);
    });
  });

  it('should invalidate an invalid payload', async () => {
    const body = { invalid: true };
    await request(uri, { method: 'POST', body, json: true }).catch((err) => {
      err.statusCode.should.be.equal(400);
    });
  });

  it('should validate a valid query string', async () => {
    const query = { foo: 'bar', example: '3' };
    const qs = stringify(query);
    td.when(validate(), { ignoreExtraArgs: true }).thenDo((_body) => {
      _body.should.be.eql(query);
    });
    await request(`${uri}?${qs}`, { method: 'GET' }, (err, response) => {
      response.statusCode.should.be.equal(200);
    });
  });

  it('should invalidate an invalid query string', async () => {
    const query = stringify({ invalid: true });
    await request(`${uri}?${query}`, { method: 'GET' }).catch((err) => {
      err.statusCode.should.be.equal(400);
    });
  });
});
