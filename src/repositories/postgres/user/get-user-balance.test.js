// import { faker } from '@faker-js/faker'
// import { prisma } from '../../../../prisma/prisma.js'
// import { user as fakerUser } from '../../../tests/fixtures/index.js'
// import { PostgresGetUserBalanceRepository } from './get-user-balance.js'

// describe('PostgresGetUserBalanceRepository', () => {
//     it('should get user balance on db', async () => {
//         // 💡 CORREÇÃO: Usando $transaction para garantir que o usuário não seja deletado
//         // antes das transações serem criadas (evita o erro Foreign Key Violation).
//         await prisma.$transaction(async (tx) => {
//             // Cria o usuário usando o cliente transacional (tx)
//             const user = await tx.user.create({ data: fakerUser })

//             // Cria as transações usando o cliente transacional (tx)
//             await tx.transaction.createMany({
//                 data: [
//                     {
//                         name: faker.string.sample(),
//                         amount: 5000,
//                         date: faker.date.recent(),
//                         type: 'EARNING',
//                         user_id: user.id,
//                     },
//                     {
//                         name: 'Freelance',
//                         amount: 5000,
//                         date: faker.date.recent(),
//                         type: 'EARNING',
//                         user_id: user.id,
//                     },
//                     {
//                         name: faker.string.sample(),
//                         amount: 1000,
//                         date: faker.date.recent(),
//                         type: 'EXPENSE',
//                         user_id: user.id,
//                     },
//                     {
//                         name: faker.string.sample(),
//                         amount: 1000,
//                         date: faker.date.recent(),
//                         type: 'EXPENSE',
//                         user_id: user.id,
//                     },
//                     {
//                         name: faker.string.sample(),
//                         amount: 3000,
//                         date: faker.date.recent(),
//                         type: 'INVESTMENT',
//                         user_id: user.id,
//                     },
//                 ],
//             })

//             // Após o commit da transação, o repositório é testado normalmente.
//             const sut = new PostgresGetUserBalanceRepository()
//             const result = await sut.execute(user.id)

//             // 💡 CORREÇÃO: Expectativas ajustadas para refletir o cálculo real:
//             // (5000 + 5000) - (1000 + 1000) - 3000 = 5000
//             expect(result.earnings.toString()).toBe('10000')
//             expect(result.expenses.toString()).toBe('2000')
//             expect(result.investments.toString()).toBe('3000')
//             expect(result.balance.toString()).toBe('5000')
//         })
//     })
// })
// src/repositories/postgres/user/get-user-balance.test.js
import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma.js'
import { user as fakerUser } from '../../../tests/fixtures/user.js'
import { PostgresGetUserBalanceRepository } from './get-user-balance.js'

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
            where: { user_id: expect.any(String), type: 'EXPENSE' },
            _sum: { amount: true },
        })
        expect(prismaSpy).toHaveBeenNthCalledWith(2, {
            where: { user_id: expect.any(String), type: 'EARNING' },
            _sum: { amount: true },
        })
        expect(prismaSpy).toHaveBeenNthCalledWith(3, {
            where: { user_id: expect.any(String), type: 'INVESTMENT' },
            _sum: { amount: true },
        })
    })
})
