import compose from 'koa-compose';
import { KoaSwaggerUiOptions } from 'koa2-swagger-ui';
import { route } from '../router';
import { generateDocsUi, generateDocs } from './docs';

export function generateDocsRoute (
  name: string,
  method: string,
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
  return compose([router.allowedMethods(), router.routes(), generateDocsUi(options)]);
}

export { generateDocs, generateDocsUi }
