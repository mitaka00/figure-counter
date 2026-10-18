import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'node_modules'] },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    rules: {
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: { allowDefaultProject: ['*.config.js', '*.config.cjs'] },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // Plain JavaScript files (configs, scripts) are not part of a TS project.
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['jest.config.cjs'],
    languageOptions: { sourceType: 'commonjs', globals: { module: 'writable' } },
  },
  {
    files: ['scripts/**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { require: 'readonly', console: 'readonly' },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      // The library must run in browsers: forbid Node-only globals in source code.
      'no-restricted-globals': ['error', 'process', 'Buffer', 'require', '__dirname', 'global'],
    },
  },
);
