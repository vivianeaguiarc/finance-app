// teste corrigido
import { prisma } from '../../../../prisma/prisma.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

import { transaction, user } from '../../../tests/fixtures/index.js'
import { PostgresDeleteTransactionRepository } from './delete-transaction.js'

describe('PostgresDeleteTransactionRepository', () => {
    it('should delete a user transaction successfully', async () => {
        await prisma.user.create({ data: user })

        // ⚠️ Normaliza a data do fixture para UTC meia-noite (DATE-safe)
        const txDate = dayjs.utc(transaction.date).startOf('day').toDate()

        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id, date: txDate },
        })

        const sut = new PostgresDeleteTransactionRepository()
        const result = await sut.execute(transaction.id)

        expect(result.name).toBe(transaction.name)
        expect(result.amount.toString()).toBe(transaction.amount.toString())
        expect(result.type).toBe(transaction.type)
        expect(result.user_id).toBe(user.id)

        // ✅ Compare só AAAA-MM-DD em UTC
        expect(dayjs.utc(result.date).format('YYYY-MM-DD')).toBe(
            dayjs.utc(transaction.date).format('YYYY-MM-DD'),
        )

        // (se preferir isSame, normalize ambos)
        expect(
            dayjs.utc(result.date).isSame(dayjs.utc(transaction.date), 'day'),
        ).toBe(true)
    })
    it('should return null if transaction does not exist', async () => {
        const sut = new PostgresDeleteTransactionRepository()
        const result = await sut.execute('non-existing-id')

        expect(result).toBeNull()
    })
    it('should call prisma with correct values', async () => {
        const prismaSpy = jest.spyOn(prisma.transaction, 'delete')
        const sut = new PostgresDeleteTransactionRepository()
        await sut.execute(transaction.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: { id: transaction.id },
        })
    })
})
