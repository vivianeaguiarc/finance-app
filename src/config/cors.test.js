import { getAllowedOrigins, getCorsOptions } from './cors.js'

describe('CORS config', () => {
    const originalEnv = process.env

    afterEach(() => {
        process.env = { ...originalEnv }
    })

    it('should allow localhost origins in development', () => {
        process.env.NODE_ENV = 'development'
        process.env.FRONTEND_URL = 'https://my-app.example.com'

        const origins = getAllowedOrigins()

        expect(origins).toContain('http://localhost:5173')
        expect(origins).toContain('https://my-app.example.com')
    })

    it('should allow only FRONTEND_URL in production', () => {
        process.env.NODE_ENV = 'production'
        process.env.FRONTEND_URL = 'https://my-app.example.com'

        const origins = getAllowedOrigins()

        expect(origins).toEqual(['https://my-app.example.com'])
    })

    it('should use permissive options in test environment', () => {
        process.env.NODE_ENV = 'test'

        expect(getCorsOptions()).toEqual({})
    })
})
