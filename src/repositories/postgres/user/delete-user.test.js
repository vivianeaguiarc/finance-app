import { user } from '../../../tests/fixtures/user'
import { prisma } from '../../../../prisma/prisma.js'
import { PostgresDeleteUserRepository } from './delete-user'

describe('DeleteUserRepository', () => {
    it('should delete a user on db', async () => {
        await prisma.user.create({
            data: user,
        })
        const sut = new PostgresDeleteUserRepository()
        const result = await sut.execute(user.id)
        expect(result).toStrictEqual(user)
    })
    it('should call prisma with correct params', async () => {
        const prismaSpy = jest.spyOn(prisma.user, 'delete')
        const sut = new PostgresDeleteUserRepository()
        await sut.execute(user.id)
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: user.id,
            },
        })
    })
    it('should return null if prisma throws', async () => {
        const sut = new PostgresDeleteUserRepository()
        jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(
            new Error('boom'),
        )

        const result = await sut.execute(user.id)

        expect(result).toBeNull()
    })
    it('should return 500 if prisma throws', async () => {
        const sut = new PostgresDeleteUserRepository()
        jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(
            new Error('boom'),
        )

        const result = await sut.execute(user.id)

        expect(result).toBeNull()
    })
})
