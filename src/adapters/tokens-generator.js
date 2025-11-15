import jwt from 'jsonwebtoken'

export class TokensGeneratorAdapter {
    execute(userId) {
        return {
            accsesToken: jwt.sign(
                { userId: user.id },
                process.env.JWT_ACCESS_SECRET,
                {
                    expiresIn: '15m',
                },
            ),
            refreshToken: jwt.sign(
                { userId: user.id },
                process.env.JWT_REFRESH_SECRET,
                {
                    expiresIn: '30d',
                },
            ),
        }
    }
}
