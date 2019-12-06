import compose from 'koa-compose';
import { KoaSwaggerUiOptions } from 'koa2-swagger-ui';
import { route } from '../router';
import { generateDocsUi, generateDocs } from './docs';

export function generateDocsRoute (
  name: string,
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  path: string,
  title: string,
  version: string,
  description: string,
  host: string,
  basePath: string,
  consumes: string[],
  produces: string[],
  apis: string[],
  tags?: { name: string, description: string}[],
  options?: KoaSwaggerUiOptions,
) {
  const router = route(name, method, path, [
    (ctx) => ctx.body = generateDocs({
      swaggerDefinition: {
        info: { title, version, description },
        host,
        basePath,
        consumes,
        produces,
        tags,
      },
      apis,
    }),
  ]);
  return compose([router.allowedMethods(), router.routes(), generateDocsUi({
    title,
    swaggerVersion: '3.23.8',
    routePrefix: path,
    hideTopbar: true,
    ...options,
  })]);
}

export { generateDocs, generateDocsUi }
