import { PostgresCreateTransactionRepository } from './create-transaction.js'
import {
    transaction,
    user as fakeUser,
} from '../../../tests/mocks/transaction.js'
import { prisma } from '../../../../prisma/prisma.js'
import dayjs from 'dayjs'

describe('PostgresCreateTransactionRepository', () => {
    it('should create a user transaction successfully', async () => {
        const user = await prisma.user.create({ data: fakeUser })
        const sut = new PostgresCreateTransactionRepository()
        const result = await sut.execute({ ...transaction, userId: user.id })

        console.log(dayjs(result.date).toISOString())
        console.log(transaction.date)

        expect(result.name).toBe(transaction.name)
        expect(result.amount.toString()).toBe(transaction.amount.toString())
        expect(result.type).toBe(transaction.type)
        expect(result.user_id).toBe(user.id)
        expect(dayjs(result.date.day()).tobe(dayjs(transaction.date).day()))
        expect(dayjs.utc(result.date).format('YYYY-MM-DD')).toBe(
            dayjs.utc(transaction.date).format('YYYY-MM-DD'),
        )
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth(),
        )
    })
})
