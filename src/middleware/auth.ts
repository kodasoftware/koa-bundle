import jwt from 'jsonwebtoken'
import { Context, Next, Middleware } from 'koa'

export interface Auth {
  sub: string
  iat: number
  exp: number
}
export interface AuthContext {
  state: { auth: Auth }
}

export function authMiddleware(
  jwt_secret: string,
  callback?: (auth: Auth, ctx: Context) => Promise<void>
): Middleware<Context & AuthContext> {
  return async (ctx: Context, next: Next) => {
    if (!ctx.header.authorization) {
      ctx.status = 401
      return
    }
    const [type, _jwt] = ctx.header.authorization.split(' ')
    if (type && _jwt && type.length > 0 && _jwt.length > 0) {
      try {
        const auth = await jwt.verify(_jwt, jwt_secret) as Auth
        if (!auth || auth.exp < Date.now()) {
          ctx.status = 401
          return
        }
        ctx.state.auth = auth
        if (typeof callback === 'function') await callback(auth, ctx)
        return next()
      } catch (err) {
        ctx.status = 401
        ctx.body = err.message
        return
      }
    } else {
      ctx.status = 401
      return
    }
  }
}
