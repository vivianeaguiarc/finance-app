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
        const result = await sut.execute({
            ...transaction,
            user_id: user.id,
            date: txDate,
        })

        expect(result.name).toBe(transaction.name)
        expect(result.amount.toString()).toBe(transaction.amount.toString())
        expect(result.type).toBe(transaction.type)
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
        const prismaSpy = import.meta.jest.spyOn(prisma.transaction, 'create')

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
    it('should throw if prisma throws', async () => {
        const sut = new PostgresCreateTransactionRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'create')
            .mockRejectedValueOnce(new Error())

        await expect(
            sut.execute({
                ...transaction,
                user_id: 'any_user_id',
                date: new Date(),
            }),
        ).rejects.toThrow()
    })
})
