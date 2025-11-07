import { user } from '../../../tests/fixtures/user'
import { PostgresCreateUserRepository } from './create-user'

describe('CreateUserRepository', () => {
    it('should create a user on db', async () => {
        const sut = new PostgresCreateUserRepository()
        const result = await sut.execute(user)
        expect(result).toBeTruthy()
    })
})
