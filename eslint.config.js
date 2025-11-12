import js from '@eslint/js'

export default [
    {
        ignores: ['node_modules', 'dist', 'coverage'],
    },
    {
        files: ['**/*.js'],
        ...js.configs.recommended,
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                node: true,
                jest: true,
            },
        },
        rules: {
            // suas regras personalizadas
        },
    },
]
