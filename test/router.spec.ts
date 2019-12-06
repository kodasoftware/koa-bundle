import 'should';
import Koa from 'koa';
import request from 'request-promise';
import td from 'testdouble';
import Router from '@koa/router';
import { route } from '../src';

describe('Router middleware', () => {
  const port = 9000;
  const uri = `http://localhost:${port}`;
  const validate = td.function('validate');
  const router = route('test-route', 'get', '/', [
    (ctx) => {
      validate();
      ctx.res.statusCode = 200;
    },
  ]);
  let app;
  let server;

  before(() => {
    app = new Koa();
    app.use(router.routes());
    app.use(router.allowedMethods());
    server = app.listen(port);
  });
  after(() => server.close());
  afterEach(() => td.reset());

  it('should return a router object', () => {
    const router = route('route', 'get', '/', []);
    router.should.be.instanceof(Router);
  });

  it('should route the request to provided route', async () => {
    await request(uri, { method: 'GET' }, (err, response) => {
      response.statusCode.should.be.equal(200);
    });
    td.verify(validate(), { times: 1 });
  });
});
