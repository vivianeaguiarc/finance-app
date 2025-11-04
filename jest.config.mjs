// jest.config.mjs
export default {
    testEnvironment: 'node',
    transform: {}, // sem Babel
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    setupFilesAfterEnv: ['./jest.setup.mjs'],
}
