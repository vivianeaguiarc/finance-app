import { prisma } from '../../../../prisma/prisma.js'
import { TransactionType } from '@prisma/client'
import { PostgresUpdateTransactionRepository } from './update-transaction.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

import {
    transaction,
    user as userFixture,
} from '../../../tests/fixtures/index.js'
import { faker } from '@faker-js/faker'

describe('PostgresUpdateTransactionRepository', () => {
    afterAll(async () => {
        await prisma.$disconnect()
    })

    it('should update a transaction on db successfully', async () => {
        // 1) cria o usuário no DB e usa o id real
        const createdUser = await prisma.user.create({ data: userFixture })

        // 2) normaliza a data (se seu campo é @db.Date)
        const txDate = dayjs.utc(transaction.date).startOf('day').toDate()
        // 3) cria a transação base no DB
        const baseTx = await prisma.transaction.create({
            data: {
                ...transaction,
                user_id: createdUser.id,
                date: txDate,
            },
        })

        const sut = new PostgresUpdateTransactionRepository()

        // 4) prepara os params com o id EXISTENTE
        const updateParams = {
            user_id: createdUser.id,
            name: faker.commerce.productName(),
            type: 'EXPENSE',
            amount: Number(faker.finance.amount()),
            date: txDate,
        }

        // CHAME COM DOIS PARÂMETROS
        const result = await sut.execute(baseTx.id, updateParams)

        expect(result.id).toBe(baseTx.id)
        expect(result.name).toBe(updateParams.name)
        expect(result.type).toBe(updateParams.type)
        // se Prisma retorna Decimal:
        expect(result.amount.toString()).toBe(String(updateParams.amount))
        // compara apenas a parte de data
        expect(dayjs.utc(result.date).format('YYYY-MM-DD')).toBe(
            dayjs.utc(updateParams.date).format('YYYY-MM-DD'),
        )
    })
    it('should call prisma with correct values', async () => {
        const createdUser = await prisma.user.create({ data: userFixture })
        const txDate = dayjs.utc(transaction.date).startOf('day').toDate()
        const baseTx = await prisma.transaction.create({
            data: {
                ...transaction,
                user_id: createdUser.id,
                date: txDate,
            },
        })

        const sut = new PostgresUpdateTransactionRepository()

        const updateParams = {
            user_id: createdUser.id, // ou userId: ... se o model usa camelCase
            name: faker.commerce.productName(),
            type: TransactionType.EARNING, // ✅ enum válido
            amount: Number(faker.finance.amount()),
            date: txDate,
        }

        const prismaSpy = jest
            .spyOn(prisma.transaction, 'update')
            .mockResolvedValueOnce({ ...baseTx, ...updateParams })

        await sut.execute(baseTx.id, updateParams)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: { id: baseTx.id },
            data: updateParams,
        })
    })
})
