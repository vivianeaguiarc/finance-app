import { jwt } from 'zod'

export class TokenVerifierAdapter {
    execute(token, secret) {
        return jwt.verify(token, secret)
    }
}
