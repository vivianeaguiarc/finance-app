import bcrypt from 'bcryptjs'

export class PasswordComparatorAdapter {
    async execute(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword)
    }
}
