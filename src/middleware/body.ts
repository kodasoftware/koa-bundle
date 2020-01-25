import koaBody from 'koa-body';

export function koaBodyMiddleware(opts?: koaBody.IKoaBodyOptions & koaBody.IKoaBodyFormidableOptions) {
  return koaBody({
    patchNode: true,
    encoding: 'utf-8',
    includeUnparsed: true,
    parsedMethods: ['POST', 'PUT', 'PATCH'],
    ...opts,
  });
}