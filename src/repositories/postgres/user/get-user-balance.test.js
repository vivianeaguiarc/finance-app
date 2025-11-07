import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma.js'
import { user as fakerUser } from '../../../tests/fixtures/user.js'
import { PostgresGetUserBalanceRepository } from './get-user-balance.js'
import { TransactionType } from '@prisma/client'

describe('PostgresGetUserBalanceRepository', () => {
    it('should get user balance on db', async () => {
        let createdUserId
        await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({ data: fakerUser })

            await tx.transaction.createMany({
                data: [
                    {
                        name: faker.string.sample(),
                        amount: 5000,
                        date: faker.date.recent(),
                        type: 'EARNING',
                        user_id: user.id,
                    },
                    {
                        name: 'Freelance',
                        amount: 5000,
                        date: faker.date.recent(),
                        type: 'EARNING',
                        user_id: user.id,
                    },
                    {
                        name: faker.string.sample(),
                        amount: 1000,
                        date: faker.date.recent(),
                        type: 'EXPENSE',
                        user_id: user.id,
                    },
                    {
                        name: faker.string.sample(),
                        amount: 1000,
                        date: faker.date.recent(),
                        type: 'EXPENSE',
                        user_id: user.id,
                    },
                    {
                        name: faker.string.sample(),
                        amount: 3000,
                        date: faker.date.recent(),
                        type: 'INVESTMENT',
                        user_id: user.id,
                    },
                ],
            })

            createdUserId = user.id
        })

        const sut = new PostgresGetUserBalanceRepository()
        const result = await sut.execute(createdUserId)

        expect(result.earnings.toString()).toBe('10000')
        expect(result.expenses.toString()).toBe('2000')
        expect(result.investments.toString()).toBe('3000')
        expect(result.balance.toString()).toBe('5000')
    })
    it('should call prisma with correct params', async () => {
        const sut = new PostgresGetUserBalanceRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'aggregate')
        await sut.execute(faker.string.uuid())
        expect(prismaSpy).toHaveBeenCalledTimes(3)
        expect(prismaSpy).toHaveBeenNthCalledWith(1, {
            where: {
                user_id: expect.any(String),
                type: TransactionType.EXPENSE,
            },
            _sum: { amount: true },
        })
        expect(prismaSpy).toHaveBeenNthCalledWith(2, {
            where: {
                user_id: expect.any(String),
                type: TransactionType.EARNING,
            },
            _sum: { amount: true },
        })
        expect(prismaSpy).toHaveBeenNthCalledWith(3, {
            where: {
                user_id: expect.any(String),
                type: TransactionType.INVESTMENT,
            },
            _sum: { amount: true },
        })
    })
})
