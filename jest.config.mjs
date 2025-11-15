// // jest.config.mjs
// export default {
//     testEnvironment: 'node',
//     transform: {}, // sem Babel (executa direto como ESM)
//     setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs', '<rootDir>/jest.setup-after-env.mjs'],
//     coverageDirectory: 'coverage',
//     coverageProvider: 'v8',
//     globalSetup: '<rootDir>/jest.global-setup.mjs',
//     testMatch: ['**/?(*.)+(spec|test).js'],
//     collectCoverageFrom: [
//         'src/**/*.js'],

//     // Ignora arquivos utilitários e dependências no cálculo da cobertura
//     coveragePathIgnorePatterns: [
//         '/node_modules/',
//         'src/controllers/helpers/transaction.js',
//         'src/controllers/helpers/user.js',
//     ],
// }

// jest.config.mjs
// jest.config.mjs
// jest.config.mjs
export default {
  testEnvironment: 'node',
  transform: {}, // sem Babel

  moduleFileExtensions: ['js', 'json'],

  // quais arquivos são considerados testes
  testMatch: ['**/*.test.js'],

  // de onde o coverage será coletado
  collectCoverageFrom: ['src/**/*.js'],

  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/controllers/helpers/transaction.js',
    'src/controllers/helpers/user.js',
  ],

  // AQUI é onde a mágica da opção A acontece:
  // Jest NÃO vai rodar esses testes (todos encostam em Prisma)
  testPathIgnorePatterns: [
    // Repositórios que usam Prisma
    'src/repositories/postgres/transaction/',
    'src/repositories/postgres/user/',

    // Testes E2E que sobem a app com Prisma
    'src/routes/user.e2e.test.js',
    'src/routes/transaction.e2e.test.js',

    // Factories de controllers que instanciam repositórios Prisma
    'src/factories/controllers/user.test.js',
    'src/factories/controllers/transaction.test.js',
  ],
}
