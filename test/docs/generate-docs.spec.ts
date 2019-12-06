import 'should';
import { docs } from '../../src';
import { version } from '../../package.json';

const { generateDocs } = docs;

describe('Generate docs', () => {
  it('should generate a swagger spec from options', () => {
    const title = 'Example';
    const description = 'Example description';
    const host = 'localhost';
    const basePath = '/';
    const consumes = ['application/json'];
    const produces = ['application/json'];
    const tags = [{ name: 'example', description: 'example of a tag' }];
    const apis = [];
    const swagger = generateDocs({
      swaggerDefinition: { info: { title, version, description }, host, basePath, consumes, produces, tags },
      apis,
    });
    swagger.should.be.Object();
    swagger.should.have.properties([
      'info', 'host', 'basePath', 'consumes', 'produces', 'tags', 'swagger', 'paths', 'definitions', 'responses',
      'parameters', 'securityDefinitions',
    ]);
    swagger.info.should.be.Object().and.eql({ title, version, description });
    swagger.host.should.be.String().and.equal(host);
    swagger.basePath.should.be.String().and.equal(basePath);
    swagger.consumes.should.be.Array().and.eql(consumes);
    swagger.produces.should.be.Array().and.eql(produces);
    swagger.tags.should.be.Array().and.eql(tags);
    swagger.swagger.should.be.String().and.equal('2.0');
  });
});
