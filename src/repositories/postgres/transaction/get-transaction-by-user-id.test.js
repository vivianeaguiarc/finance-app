import { prisma } from '../../../../prisma/prisma.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

import { transaction, user } from '../../../tests/fixtures/index.js'
import { PostgresDeleteTransactionRepository } from './delete-transaction.js'

describe('PostgresDeleteTransactionRepository', () => {
    it('should delete a user transaction successfully', async () => {
        await prisma.user.create({ data: user })
        const txDate = dayjs.utc(transaction.date).startOf('day').toDate()
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id, date: txDate },
        })

        const sut = new PostgresDeleteTransactionRepository()
        const result = await sut.execute(transaction.id)
        // Verificações
        expect(result.name).toBe(transaction.name)
        expect(result.amount.toString()).toBe(transaction.amount.toString())
        expect(result.type).toBe(transaction.type)
        expect(result.user_id).toBe(user.id)

        expect(dayjs.utc(result.date).format('YYYY-MM-DD')).toBe(
            dayjs.utc(transaction.date).format('YYYY-MM-DD'),
        )
        expect(
            dayjs.utc(result.date).isSame(dayjs.utc(transaction.date), 'day'),
        ).toBe(true)
    })
})
