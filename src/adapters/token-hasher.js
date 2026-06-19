import bcrypt from 'bcrypt'

export class TokenHasherAdapter {
    hash(token) {
        return bcrypt.hash(token, 10)
    }

    compare(token, hash) {
        return bcrypt.compare(token, hash)
    }
}
