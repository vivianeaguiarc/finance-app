// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'

export default [
    { ignores: ['node_modules/', 'dist/', 'coverage/', '.postgres/'] },
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: { ...globals.node, ...globals.es2024 },
        },
        rules: {
            'no-console': 'off',
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        },
    },
]
