import swagger from 'swagger-jsdoc';
import swaggerUi, { KoaSwaggerUiOptions } from 'koa2-swagger-ui';

export const generateDocs = (options?: swagger.Options): { [key: string]: any } => swagger(options);
export const generateDocsUi = (options?: KoaSwaggerUiOptions) => swaggerUi(options);
