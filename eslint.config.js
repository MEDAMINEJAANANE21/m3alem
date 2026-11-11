import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['**/node_modules/', '**/dist/', 'coverage/'] },
  js.configs.recommended,
  {
    files: ['backend/**/*.js', 'eslint.config.js', 'frontend/vite.config.js'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['frontend/src/**/*.js'],
    languageOptions: { globals: globals.browser },
  },
  {
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['error'] }],
      eqeqeq: 'error',
      'prefer-const': 'error',
    },
  },
  {
    files: ['backend/src/server.js', 'backend/scripts/**/*.js'],
    rules: { 'no-console': 'off' },
  },
];
