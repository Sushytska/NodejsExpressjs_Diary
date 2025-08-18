import eslintPluginTs from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';

export default [
  prettierConfig,
  {
    files: ['**/*.ts', '**/*.js'],
    ignores: ['dist/**', 'node_modules/**'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: {
      '@typescript-eslint': eslintPluginTs
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      '@typescript-eslint/no-unused-vars': ['warn']
    }
  }
];
// This ESLint configuration is set up to work with TypeScript and JavaScript files, using the TypeScript ESLint plugin and parser.
// It enforces the use of semicolons and single quotes, and warns about unused variables