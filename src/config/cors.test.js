import { getAllowedOrigins, getCorsOptions, isOriginAllowed } from './cors.js'

describe('CORS config', () => {
    const originalEnv = { ...process.env }

    afterEach(() => {
        process.env = { ...originalEnv }
    })

    it('should allow common localhost origins in development', () => {
        process.env.NODE_ENV = 'development'
        process.env.FRONTEND_URL = 'https://my-app.example.com'

        const origins = getAllowedOrigins()

        expect(origins).toContain('http://localhost:3000')
        expect(origins).toContain('http://localhost:3001')
        expect(origins).toContain('http://localhost:5173')
        expect(origins).toContain('http://localhost:5174')
        expect(origins).toContain('https://my-app.example.com')
    })

    it('should allow only FRONTEND_URL in production', () => {
        process.env.NODE_ENV = 'production'
        process.env.FRONTEND_URL = 'https://my-app.example.com'

        const origins = getAllowedOrigins()

        expect(origins).toEqual(['https://my-app.example.com'])
    })

    it('should block unknown origins in production', () => {
        process.env.NODE_ENV = 'production'
        process.env.FRONTEND_URL = 'https://my-app.example.com'

        expect(isOriginAllowed('https://evil.example.com')).toBe(false)
        expect(isOriginAllowed('https://my-app.example.com')).toBe(true)
    })

    it('should allow requests without Origin header', () => {
        process.env.NODE_ENV = 'production'
        process.env.FRONTEND_URL = 'https://my-app.example.com'

        expect(isOriginAllowed(undefined)).toBe(true)
    })

    it('should enable credentials outside test environment', () => {
        process.env.NODE_ENV = 'development'
        process.env.FRONTEND_URL = 'http://localhost:5173'

        expect(getCorsOptions()).toMatchObject({ credentials: true })
    })

    it('should use permissive options in test environment', () => {
        process.env.NODE_ENV = 'test'

        expect(getCorsOptions()).toEqual({})
    })
})
