import fs from 'fs'
import { join } from 'path'

describe('swagger.json', () => {
    const swaggerPath = join(process.cwd(), 'docs', 'swagger.json')
    let document

    beforeAll(() => {
        document = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'))
    })

    it('should be valid OpenAPI/Swagger 2.0 document', () => {
        expect(document.swagger).toBe('2.0')
        expect(document.info.title).toBeTruthy()
        expect(document.paths).toBeDefined()
    })

    it('should define bearerAuth security scheme', () => {
        expect(document.securityDefinitions.bearerAuth).toBeDefined()
        expect(document.securityDefinitions.bearerAuth.name).toBe(
            'Authorization',
        )
    })

    it('should not expose password in public user response schemas', () => {
        const userResponse = document.definitions.UserResponse
        expect(userResponse.properties.password).toBeUndefined()
        expect(userResponse.properties.passwordHash).toBeUndefined()
    })

    it('should document health, dashboard and transaction list endpoints', () => {
        expect(document.paths['/']).toBeDefined()
        expect(document.paths['/health']?.get).toBeDefined()
        expect(document.paths['/api/dashboard']?.get).toBeDefined()
        expect(document.paths['/api/transactions/me']?.get).toBeDefined()
    })

    it('should document auth endpoints including logout', () => {
        expect(document.paths['/api/users/login']?.post).toBeDefined()
        expect(document.paths['/api/users/refresh-token']?.post).toBeDefined()
        expect(document.paths['/api/users/logout']?.post).toBeDefined()
        expect(document.paths['/api/users/logout-all']?.post).toBeDefined()
    })
})
