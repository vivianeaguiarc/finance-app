// jest.setup.mjs
import { jest } from '@jest/globals'
globalThis.jest = jest
beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
    console.error.mockRestore?.()
})
