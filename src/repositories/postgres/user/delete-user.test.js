// import { user } from '../../../tests/fixtures/user'
// import { prisma } from '../../../../prisma/prisma.js'
// import { PostgresDeleteUserRepository } from './delete-user'
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js'
// import { UserNotFoundError } from '../../../errors/user.js'

// describe('DeleteUserRepository', () => {
//     it('should delete a user on db', async () => {
//         await prisma.user.create({
//             data: user,
//         })
//         const sut = new PostgresDeleteUserRepository()
//         const result = await sut.execute(user.id)
//         expect(result).toStrictEqual(user)
//     })
//     it('should call prisma with correct params', async () => {
//         await prisma.user.create({
//             data: user,
//         })
//         const prismaSpy = jest.spyOn(prisma.user, 'delete')
//         const sut = new PostgresDeleteUserRepository()
//         await sut.execute(user.id)
//         expect(prismaSpy).toHaveBeenCalledWith({
//             where: {
//                 id: user.id,
//             },
//         })
//     })
//     it('should return null if prisma throws', async () => {
//         const sut = new PostgresDeleteUserRepository()
//         jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(
//             new Error('boom'),
//         )

//         const result = await sut.execute(user.id)

//         expect(result).toBeNull()
//     })
//     it('should return 500 if prisma throws', async () => {
//         const sut = new PostgresDeleteUserRepository()
//         jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(
//             new Error('boom'),
//         )

//         const result = await sut.execute(user.id)

//         expect(result).toBeNull()
//     })
//     it('should throw generic if prisma throws generic error', async () => {
//         const sut = new PostgresDeleteUserRepository()
//         jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(
//             new Error()
//         )

//         const promise = sut.execute(user.id)
//         await expect(promise).rejects.toThrowError(Error)
//     })
//     it('should throw generic if prisma throws generic error', async () => {
//         const sut = new PostgresDeleteUserRepository()
//         jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(
//             new PrismaClientKnownRequestError('', { code: 'P2025', clientVersion: '3.0.0' })
//         )

//         const promise = sut.execute(user.id)
//         await expect(promise).rejects.toThrowError(new UserNotFoundError(user.id))
//     })
// })
import { user } from '../../../tests/fixtures/user'
import { prisma } from '../../../../prisma/prisma.js'
import { PostgresDeleteUserRepository } from './delete-user'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js'
import { UserNotFoundError } from '../../../errors/user.js'

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
        await prisma.user.create({
            data: user,
        })
        const prismaSpy = jest.spyOn(prisma.user, 'delete')
        const sut = new PostgresDeleteUserRepository()
        await sut.execute(user.id)
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: user.id,
            },
        })
    })

    it('should re-throw generic error if prisma throws', async () => {
        const sut = new PostgresDeleteUserRepository()
        const mockError = new Error('boom')
        jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(mockError)
        await expect(sut.execute(user.id)).rejects.toThrow(mockError)
    })

    it('should throw UserNotFoundError generic if prisma does not find to delete', async () => {
        const sut = new PostgresDeleteUserRepository()
        const mockError = new Error()
        jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(mockError)
        const promise = sut.execute(user.id)
        await expect(promise).rejects.toThrow(mockError)
    })

    it('should throw UserNotFoundError if user does not exist (P2025)', async () => {
        const sut = new PostgresDeleteUserRepository()

        jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(
            new PrismaClientKnownRequestError('Record not found', {
                code: 'P2025',
                clientVersion: '3.0.0',
            }),
        )
        const promise = sut.execute(user.id)
        await expect(promise).rejects.toThrow(UserNotFoundError)
    })
})
