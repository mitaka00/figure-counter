// Checks the BUILT package the way consumers will load it:
//  1. CommonJS require (older Node tooling)
//  2. ESM import (bundlers, modern Node)
const example = [
  [true, false, false, false, false],
  [true, false, true, true, false],
  [false, true, false, true, false],
  [false, true, true, true, false],
  [false, false, false, false, true],
];

function check(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
  }
}

const cjs = require('../dist/index.cjs');
check(cjs.countFigures(example), 3, 'CJS build');

(async () => {
  const esm = await import('../dist/index.js');
  check(esm.countFigures(example), 3, 'ESM build');

  console.log('Smoke test passed: both the ESM and CJS builds return 3.');
})();
