// src/repositories/postgres/transaction/create-transaction.test.js
import { prisma } from '../../../../prisma/prisma.js'
import { PostgresCreateTransactionRepository } from './create-transaction.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

// ✅ use o arquivo que realmente existe
import { transaction, user as fakeUser } from '../../../tests/fixtures/index.js' // ajuste se seu fixture estiver noutro lugar

describe('PostgresCreateTransactionRepository', () => {
    afterAll(async () => {
        await prisma.$disconnect()
    })

    it('should create a user transaction successfully', async () => {
        // cria user real e normaliza a data (se seu campo é @db.Date)
        const user = await prisma.user.create({ data: fakeUser })
        const txDate = dayjs.utc(transaction.date).startOf('day').toDate()

        const sut = new PostgresCreateTransactionRepository()

        // ⚠️ use a MESMA chave do seu model Prisma:
        // - se o model usa "userId" (camelCase com @map("user_id")), use userId:
        // const result = await sut.execute({ ...transaction, userId: user.id, date: txDate })
        // - se o model usa "user_id" (snake_case), use user_id:
        const result = await sut.execute({
            ...transaction,
            user_id: user.id,
            date: txDate,
        })

        // asserts
        expect(result.name).toBe(transaction.name)
        // Prisma.Decimal -> compare como string
        expect(result.amount.toString()).toBe(transaction.amount.toString())
        expect(result.type).toBe(transaction.type)

        // ⚠️ idem aqui: se o retorno do Prisma é "userId" (camelCase), troque para result.userId
        expect(result.user_id).toBe(user.id)

        // compare apenas a parte de data (evita fuso)
        expect(dayjs.utc(result.date).format('YYYY-MM-DD')).toBe(
            dayjs.utc(txDate).format('YYYY-MM-DD'),
        )
    })
    it('should call prisma with correct params', async () => {
        const user = await prisma.user.create({ data: fakeUser })
        const txDate = dayjs.utc(transaction.date).startOf('day').toDate()
        const sut = new PostgresCreateTransactionRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'create')

        await sut.execute({
            ...transaction,
            user_id: user.id,
            date: txDate,
        })

        expect(prismaSpy).toHaveBeenCalledWith({
            data: expect.objectContaining({
                name: transaction.name,
                amount: transaction.amount,
                type: transaction.type,
                user_id: user.id,
                date: txDate,
                id: expect.any(String),
            }),
        })
    })
})
