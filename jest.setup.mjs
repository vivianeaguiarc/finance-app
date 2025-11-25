import { jest } from '@jest/globals'

// torna o jest global (necessário em ESM)
globalThis.jest = jest

// remove console.error vermelho dos testes
beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
})

// restaura após os testes
afterAll(() => {
    console.error.mockRestore?.()
})
