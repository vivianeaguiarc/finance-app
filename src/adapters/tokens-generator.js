import jwt from 'jsonwebtoken'

export class TokensGeneratorAdapter {
    generateAccessToken(userId) {
        return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
        })
    }
}
