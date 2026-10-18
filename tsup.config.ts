import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  // ESM for `import` (bundlers, modern Node, browsers), CJS for `require` (older Node tooling).
  format: ['esm', 'cjs'],
  target: 'es2018',
  platform: 'neutral',
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  treeshake: true,
});
