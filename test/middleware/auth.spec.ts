import 'should';
import Koa from 'koa';
import request from 'request-promise';
import td from 'testdouble';
import jwt from 'jsonwebtoken'
import { middleware } from '../../src';

const { authMiddleware } = middleware;

describe('Auth middleware', () => {
  const port = 9000;
  const uri = `http://localhost:${port}`;
  const secret = 'some-secret'
  const command = td.func()
  let app;
  let server;

  before(() => {
    app = new Koa();
    app.use(authMiddleware(secret));
    app.use((ctx) => {
      command(ctx.state.auth);
      ctx.status = 200
    });
    server = app.listen(port);
  });
  afterEach(() => td.reset());
  after(() => server.close());

  it('should return a middleware function', () => {
    const middleware = authMiddleware('');
    authMiddleware.should.be.Function();
    middleware.should.be.Function();
  });

  it('should set state for a valid jwt', async () => {
    const payload = { sub: 'id' }
    const token = jwt.sign(payload, secret)
    const headers = { Authorization: 'Bearer ' + token };
    td.when(command(), { ignoreExtraArgs: true }).thenDo((auth) => {
      auth.should.have.properties(['sub', 'iat'])
      auth.sub.should.be.equal(payload.sub);
    })
    await request(uri, { method: 'POST', headers, json: true });
  });

  it('should return 401 for invalid jwt', async () => {
    const payload = { sub: 'id' }
    const token = jwt.sign(payload, 'some-other-secret')
    const headers = { Authorization: 'Bearer ' + token };
    await request(uri, { method: 'POST', headers, json: true }).catch(err => err.statusCode.should.be.equal(401));
  });
  it('should return 401 for invalid auth header (no bearer)', async () => {
    const payload = { sub: 'id' }
    const token = jwt.sign(payload, secret)
    const headers = { 'Authorization': token }
    await request(uri, { method: 'POST', headers, json: true }).catch(err => err.statusCode.should.be.equal(401));
  });
  it('should return 401 for invalid auth header', async () => {
    const payload = { sub: 'id' }
    const token = jwt.sign(payload, secret)
    const headers = { 'Authorization': 'Bearer' + token }
    await request(uri, { method: 'POST', headers, json: true }).catch(err => err.statusCode.should.be.equal(401));
  });
  it('should return 401 if missing authorization header', async () => {
    const headers = {}
    await request(uri, { method: 'POST', headers, json: true }).catch(err => err.statusCode.should.be.equal(401));
  });
});
