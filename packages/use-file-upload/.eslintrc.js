/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@yoonhaemin-lib/eslint-config/library.js'],
  parser: '@typescript-eslint/parser',
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
