import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma.js'
import { user as fakeUser } from '../../../tests/fixtures/index.js'
import { PostgresUpdateUserRepository } from './update-user.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js'
import { UserNotFoundError } from '../../../errors/user.js'

describe('PostgresUpdateUserRepository', () => {
    const updateUserParams = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }
    it('should update a user on db', async () => {
        const user = await prisma.user.create({ data: fakeUser })
        const sut = new PostgresUpdateUserRepository()
        const result = await sut.execute(user.id, updateUserParams)
        expect(result).toStrictEqual(updateUserParams)
    })
    it('should call prisma with correct params', async () => {
        const created = await prisma.user.create({ data: fakeUser }) // <- cria no DB

        const sut = new PostgresUpdateUserRepository()
        const prismaSpy = jest.spyOn(prisma.user, 'update')

        await sut.execute(created.id, updateUserParams)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: { id: created.id },
            data: updateUserParams,
        })
    })
    it('should throw if prisma throws', async () => {
        const sut = new PostgresUpdateUserRepository()
        jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(new Error())
        const promise = sut.execute(faker.string.uuid(), updateUserParams)
        await expect(promise).rejects.toThrow()
    })
    it('should throw if prisma throws', async () => {
        const sut = new PostgresUpdateUserRepository()
        jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(new Error())
        const promise = sut.execute(faker.string.uuid(), updateUserParams)
        await expect(promise).rejects.toThrow()
    })
    it('should throw UserNotFoundError generic if prisma does not find to update', async () => {
        const sut = new PostgresUpdateUserRepository()
        jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(
            new PrismaClientKnownRequestError('', {
                code: 'P2025',
                clientVersion: '3.0.0',
            }),
        )

        const promise = sut.execute(updateUserParams.id, updateUserParams)
        await expect(promise).rejects.toThrow(
            new UserNotFoundError(updateUserParams.id),
        )
    })
})
