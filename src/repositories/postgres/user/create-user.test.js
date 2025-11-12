import { user } from '../../../tests/fixtures/user'
import { PostgresCreateUserRepository } from './create-user'
import { prisma } from '../../../../prisma/prisma.js'

describe('CreateUserRepository', () => {
    it('should create a user on db', async () => {
        const sut = new PostgresCreateUserRepository()
        const result = await sut.execute(user)
        expect(result.id).toBe(user.id)
        expect(result.name).toBe(user.name)
        expect(result.email).toBe(user.email)
    })
    it('should call prisma with correct params', async () => {
        const prismaSpy = import.meta.jest.spyOn(prisma.user, 'create')
        const sut = new PostgresCreateUserRepository()
        await sut.execute(user)
        expect(prismaSpy).toHaveBeenCalledWith({
            data: user,
        })
    })
    it('should throw if prisma throws', async () => {
        const sut = new PostgresCreateUserRepository()
        import.meta.jest
            .spyOn(prisma.user, 'create')
            .mockRejectedValueOnce(new Error())
        const promise = sut.execute(user)
        await expect(promise).rejects.toThrow()
    })
})
