import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma.js'
import { user as fakerUser } from '../../../tests/fixtures/user.js'
import { PostgresGetUserBalanceRepository } from './get-user-balance.js'
import { TransactionType } from '@prisma/client'

describe('PostgresGetUserBalanceRepository', () => {
    const from = '2023-01-01'
    const to = '2023-12-31'

    it('should get user balance on db', async () => {
        let createdUserId
        await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({ data: fakerUser })

            await tx.transaction.createMany({
                data: [
                    {
                        name: faker.string.sample(),
                        amount: 5000,
                        date: new Date(from),
                        type: 'EARNING',
                        user_id: user.id,
                    },
                    {
                        name: 'Freelance',
                        amount: 5000,
                        date: new Date(from),
                        type: 'EARNING',
                        user_id: user.id,
                    },
                    {
                        name: faker.string.sample(),
                        amount: 1000,
                        date: new Date(to),
                        type: 'EXPENSE',
                        user_id: user.id,
                    },
                    {
                        name: faker.string.sample(),
                        amount: 1000,
                        date: new Date(to),
                        type: 'EXPENSE',
                        user_id: user.id,
                    },
                    {
                        name: faker.string.sample(),
                        amount: 3000,
                        date: new Date(to),
                        type: 'INVESTMENT',
                        user_id: user.id,
                    },
                ],
            })

            createdUserId = user.id
        })

        const sut = new PostgresGetUserBalanceRepository()
        const result = await sut.execute(createdUserId, from, to)
        expect(result.earnings.toString()).toBe('10000')
        expect(result.expenses.toString()).toBe('2000')
        expect(result.investments.toString()).toBe('3000')
        expect(result.balance.toString()).toBe('5000')
    })
    it('should call prisma with correct params', async () => {
        const sut = new PostgresGetUserBalanceRepository()
        const prismaSpy = import.meta.jest.spyOn(
            prisma.transaction,
            'aggregate',
        )
        await sut.execute(faker.string.uuid(), from, to)
        expect(prismaSpy).toHaveBeenCalledTimes(3)
        expect(prismaSpy).toHaveBeenNthCalledWith(1, {
            where: {
                user_id: expect.any(String),
                type: TransactionType.EXPENSE,
                date: { gte: new Date(from), lte: new Date(to) },
            },
            _sum: { amount: true },
        })
        expect(prismaSpy).toHaveBeenNthCalledWith(2, {
            where: {
                user_id: expect.any(String),
                type: TransactionType.EARNING,
                date: { gte: new Date(from), lte: new Date(to) },
            },
            _sum: { amount: true },
        })
        expect(prismaSpy).toHaveBeenNthCalledWith(3, {
            where: {
                user_id: expect.any(String),
                type: TransactionType.INVESTMENT,
                date: { gte: new Date(from), lte: new Date(to) },
            },
            _sum: { amount: true },
        })
    })
})
it('should throw if Prisma throws', async () => {
    const sut = new PostgresGetUserBalanceRepository()
    import.meta.jest
        .spyOn(prisma.transaction, 'aggregate')
        .mockRejectedValueOnce(new Error())
    const promise = sut.execute(faker.string.uuid(), from, to)
    await expect(promise).rejects.toThrow()
})
