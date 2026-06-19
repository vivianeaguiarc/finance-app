import { sanitizeUser, sanitizeUserWithTokens } from './sanitize-user.js'

describe('sanitizeUser helpers', () => {
    it('should remove password from user object', () => {
        const user = {
            id: '1',
            email: 'test@example.com',
            password: 'hashed-password',
        }

        expect(sanitizeUser(user)).toEqual({
            id: '1',
            email: 'test@example.com',
        })
    })

    it('should remove password and keep tokens', () => {
        const user = {
            id: '1',
            email: 'test@example.com',
            password: 'hashed-password',
            tokens: {
                accessToken: 'access',
                refreshToken: 'refresh',
            },
        }

        expect(sanitizeUserWithTokens(user)).toEqual({
            id: '1',
            email: 'test@example.com',
            tokens: {
                accessToken: 'access',
                refreshToken: 'refresh',
            },
        })
    })
})
