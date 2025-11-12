import { prisma } from '../../../../prisma/prisma.js'
import { user as fakeUser } from '../../../tests/fixtures/index.js'
import { PostgresGetUserByEmailRepository } from './get-user-by-email.js'

describe('GetUserByEmailRepository', () => {
    it('should get a user by email on db', async () => {
        const user = await prisma.user.create({ data: fakeUser })
        const sut = new PostgresGetUserByEmailRepository()
        const result = await sut.execute(user.email)
        expect(result).toStrictEqual(user)
    })
    it('should call prisma with correct params', async () => {
        const prismaSpy = import.meta.jest.spyOn(prisma.user, 'findUnique')
        const sut = new PostgresGetUserByEmailRepository()
        await sut.execute(fakeUser.email)
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                email: fakeUser.email,
            },
        })
    })
    it('should throw if prisma throws', async () => {
        const sut = new PostgresGetUserByEmailRepository()
        import.meta.jest
            .spyOn(prisma.user, 'findUnique')
            .mockRejectedValueOnce(new Error())
        const promise = sut.execute(fakeUser.email)
        await expect(promise).rejects.toThrow()
    })
})
