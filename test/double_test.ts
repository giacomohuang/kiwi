import { parseSchema, compileSchema } from '../src/kiwi';
import * as assert from 'node:assert';

function runTest() {
  console.log('Running Kiwi Double Precision Verification Test...\n');

  const schemaText = `
    message Test {
      float f32 = 1;
      double f64 = 2;
    }
  `;

  const schema = parseSchema(schemaText);
  const schemaObj = compileSchema(schema);

  const highPrecisionValue = 3.14159265358979323846; // Pi with high precision
  const message = {
    f32: highPrecisionValue,
    f64: highPrecisionValue,
  };

  const encoded = schemaObj.encodeTest(message);
  const decoded = schemaObj.decodeTest(encoded);

  console.log(`Original: ${highPrecisionValue}`);
  console.log(`Float32:  ${decoded.f32}`);
  console.log(`Double64: ${decoded.f64}`);

  // Float32 should lose precision
  assert.notStrictEqual(decoded.f32, highPrecisionValue, 'Float32 should have lost precision');
  
  // Double64 should preserve precision
  assert.strictEqual(decoded.f64, highPrecisionValue, 'Double64 must preserve full precision');
  assert.ok(Object.is(decoded.f64, highPrecisionValue), 'Double64 must be bit-identical');

  // Test special values
  const specialValues = [
    0,
    -0,
    NaN,
    Infinity,
    -Infinity,
    Number.MAX_VALUE,
    Number.MIN_VALUE,
    Number.MAX_SAFE_INTEGER,
    Number.MIN_SAFE_INTEGER,
    1 / 3,
  ];

  console.log('\nVerifying special values for Double64:');
  for (const val of specialValues) {
    const encodedVal = schemaObj.encodeTest({ f64: val });
    const decodedVal = schemaObj.decodeTest(encodedVal);
    
    const match = Object.is(val, decodedVal.f64);
    console.log(`- Value: ${String(val).padEnd(25)} Match: ${match ? '✅' : '❌'}`);
    
    assert.ok(match, `Double64 failed to preserve value: ${val}`);
  }

  console.log('\n--- ALL TESTS PASSED ---');
}

try {
  runTest();
} catch (e) {
  console.error('\n--- TEST FAILED ---');
  console.error(e);
  process.exit(1);
}
