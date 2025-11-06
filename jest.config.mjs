// jest.config.mjs
export default {
    testEnvironment: 'node',
    transform: {}, // sem Babel (executa direto como ESM)
    setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    testMatch: ['**/?(*.)+(spec|test).js'],
    collectCoverageFrom: [
        'src/**/*.js'],

    // Ignora arquivos utilitários e dependências no cálculo da cobertura
    coveragePathIgnorePatterns: [
        '/node_modules/',
        'src/controllers/helpers/transaction.js',
        'src/controllers/helpers/user.js',
    ],

    // // Opcional: se quiser definir metas de cobertura globais
    // coverageThreshold: {
    //     global: {
    //         statements: 85,
    //         branches: 80,
    //         functions: 85,
    //         lines: 85,
    //     },
    // },
}
