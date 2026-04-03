import { parseSchema, encodeBinarySchema, decodeBinarySchema } from '../src/kiwi';
import * as assert from 'node:assert';

function runTest() {
  console.log('Running Kiwi Binary Schema Serialization Test...\n');

  const schemaText = `
    message BinaryTest {
      double f64 = 1;
    }
  `;

  const schema = parseSchema(schemaText);
  const binary = encodeBinarySchema(schema);
  const decodedSchema = decodeBinarySchema(binary);

  const field = decodedSchema.definitions[0].fields[0];
  console.log(`Original field type: double`);
  console.log(`Decoded field type: ${field.type}`);

  assert.strictEqual(field.type, 'double', 'Binary schema failed to preserve double type name');

  console.log('\n--- BINARY SCHEMA TEST PASSED ---');
}

try {
  runTest();
} catch (e) {
  console.error('\n--- TEST FAILED ---');
  console.error(e);
  process.exit(1);
}
