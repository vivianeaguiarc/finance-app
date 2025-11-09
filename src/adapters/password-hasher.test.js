import bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'
import { PasswordHasherAdapter } from './password-hasher.js'

describe('PasswordHasherAdapter', () => {
    it('should hash the password using bcrypt', async () => {
        const sut = new PasswordHasherAdapter()
        const password = faker.internet.password() // 🔐 senha aleatória

        const hash = await sut.execute(password)

        expect(typeof hash).toBe('string')
        expect(hash).toBeTruthy()

        const isMatch = await bcrypt.compare(password, hash)
        expect(isMatch).toBe(true)
    })

    it('should generate different hashes for the same password (because of salt)', async () => {
        const sut = new PasswordHasherAdapter()
        const password = faker.internet.password()

        const hash1 = await sut.execute(password)
        const hash2 = await sut.execute(password)

        expect(hash1).not.toBe(hash2)
    })
})
