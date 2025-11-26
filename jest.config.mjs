export default {
    testEnvironment: 'node',
    silent: true,

    transform: {},

    moduleFileExtensions: ['js', 'json'],

    setupFiles: ['dotenv/config'],

    setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],

    testMatch: ['**/*.test.js'],

    collectCoverageFrom: ['src/**/*.js'],

    coveragePathIgnorePatterns: [
        '/node_modules/',
        'src/controllers/helpers/transaction.js',
        'src/controllers/helpers/user.js',
    ],

    testPathIgnorePatterns: [
        'src/repositories/postgres/transaction/',
        'src/repositories/postgres/user/',
        'src/routes/transaction.e2e.test.js',
        'src/factories/controllers/user.test.js',
        'src/factories/controllers/transaction.test.js',
    ],

    watchPathIgnorePatterns: ['<rootDir>/.postgres-data'],
    modulePathIgnorePatterns: ['<rootDir>/.postgres-data'],

}
