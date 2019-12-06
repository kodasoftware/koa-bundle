import 'should';
import { docs } from '../../src';

const { generateDocsUi } = docs;

describe('Generate docs UI', () => {
  it('should generate a swagger ui middleware from options', () => {
    const swaggerUi = generateDocsUi();
    swaggerUi.should.be.Function();
  });
});
