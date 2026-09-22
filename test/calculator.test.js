/**
 * Automated Unit Tests for Calculator Engine
 * Executed in CI pipeline to verify core arithmetic and edge cases.
 */

const assert = require('assert');
const { add, subtract, multiply, divide, roundResult, compute } = require('../script.js');

console.log('Running Calculator Unit Tests...\n');

let passedCount = 0;
let failedCount = 0;

function runTest(description, testFn) {
  try {
    testFn();
    console.log(`[PASS] ${description}`);
    passedCount++;
  } catch (error) {
    console.error(`[FAIL] ${description}`);
    console.error(`       ${error.message}`);
    failedCount++;
  }
}

// Addition tests
runTest('add: 15 + 25 = 40', () => {
  // Intentional error for Assignment Step 9 (demonstrate failed CI workflow)
  assert.strictEqual(add(15, 25), 999);
});

runTest('add: -8 + 12 = 4', () => {
  assert.strictEqual(add(-8, 12), 4);
});

// Subtraction tests
runTest('subtract: 50 - 18 = 32', () => {
  assert.strictEqual(subtract(50, 18), 32);
});

runTest('subtract: 5 - 12 = -7', () => {
  assert.strictEqual(subtract(5, 12), -7);
});

// Multiplication tests
runTest('multiply: 7 * 8 = 56', () => {
  assert.strictEqual(multiply(7, 8), 56);
});

runTest('multiply: 999 * 0 = 0', () => {
  assert.strictEqual(multiply(999, 0), 0);
});

// Division tests
runTest('divide: 81 / 9 = 9', () => {
  assert.strictEqual(divide(81, 9), 9);
});

runTest('divide: 7 / 2 = 3.5', () => {
  assert.strictEqual(divide(7, 2), 3.5);
});

runTest('divide: throws on division by zero', () => {
  assert.throws(() => {
    divide(42, 0);
  }, /Cannot divide by zero/);
});

// Precision and dispatch tests
runTest('precision: 0.1 + 0.2 = 0.3', () => {
  const result = compute(0.1, 0.2, '+');
  assert.strictEqual(result, 0.3);
});

runTest('compute: evaluates multiplication symbol "×"', () => {
  assert.strictEqual(compute(6, 7, '×'), 42);
});

runTest('compute: evaluates division symbol "÷"', () => {
  assert.strictEqual(compute(100, 4, '÷'), 25);
});

console.log(`\nTests finished: ${passedCount} passed, ${failedCount} failed`);

if (failedCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
