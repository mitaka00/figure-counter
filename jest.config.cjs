/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.jest.json' }],
  },
  // Sources use ESM-style `./file.js` specifiers; map them back to the .ts files.
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  collectCoverageFrom: ['src/**/*.ts'],
  coverageThreshold: {
    global: { branches: 95, functions: 100, lines: 95, statements: 95 },
  },
};
