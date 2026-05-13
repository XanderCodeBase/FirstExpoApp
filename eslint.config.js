const expoConfig = require('eslint-config-expo/flat');

module.exports = [
    ...expoConfig,
    {
        ignores: ['dist/**', 'node_modules/**', 'src/drizzle/**', '.expo/**'],
    },
    {
        plugins: {
            'simple-import-sort': require('eslint-plugin-simple-import-sort'),
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
];
