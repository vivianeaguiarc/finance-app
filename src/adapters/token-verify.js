import jwt from 'jsonwebtoken'

export class TokenVerifierAdapter {
    execute(token, secret) {
        try {
            return jwt.verify(token, secret) // retorna payload
        } catch (error) {
            return null // deixa o use case decidir se isso é Unauthorized
        }
    }
}
