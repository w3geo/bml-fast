/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'plugin:import/recommended',
    '@vue/eslint-config-prettier/skip-formatting',
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.tsx'],
        moduleDirectory: ['src', 'node_modules'],
      },
    },
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'import/extensions': ['error', 'always', { ignorePackages: true }],
  },
};
