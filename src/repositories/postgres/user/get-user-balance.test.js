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

        // 1) Cria usuário e transações dentro de UMA transação
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

        // 2) Só depois do commit chamamos o repositório “normal”
        const sut = new PostgresGetUserBalanceRepository()
        const result = await sut.execute(createdUserId)

        // (5000 + 5000) - (1000 + 1000) - 3000 = 5000
        expect(result.earnings.toString()).toBe('10000')
        expect(result.expenses.toString()).toBe('2000')
        expect(result.investments.toString()).toBe('3000')
        expect(result.balance.toString()).toBe('5000')
    })
})
