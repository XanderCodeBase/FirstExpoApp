// eslint.config.ts   (or eslint.config.js)
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const simpleImportSort = require('eslint-plugin-simple-import-sort');

module.exports = defineConfig([
    expoConfig,
    {
        ignores: ['dist/*'],

        plugins: {
            'simple-import-sort': simpleImportSort,
        },

        settings: {
            'import/resolver': {
                typescript: {
                    project: './tsconfig.json',
                },
            },
        },

        rules: {
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            'no-duplicate-imports': 'error',
        },
    },
]);
