// jest.config.mjs
export default {
    testEnvironment: 'node',
    transform: {}, // sem Babel (executa direto como ESM)
    setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs', '<rootDir>/jest.setup-after-env.mjs'],
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    globalSetup: '<rootDir>/jest.global-setup.mjs',
    testMatch: ['**/?(*.)+(spec|test).js'],
    collectCoverageFrom: [
        'src/**/*.js'],

    // Ignora arquivos utilitários e dependências no cálculo da cobertura
    coveragePathIgnorePatterns: [
        '/node_modules/',
        'src/controllers/helpers/transaction.js',
        'src/controllers/helpers/user.js',
    ],
}

