import { prisma } from '../../../../prisma/prisma.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

import { transaction, user } from '../../../tests/fixtures/index.js'
import { PostgresDeleteTransactionRepository } from './delete-transaction.js'
import { TransactionNotFoundError } from '../../../errors/index.js' // Importar o erro
import { PostgresGetTransactionsByUserIdRepository } from './get-transaction-by-user-id.js'

// Função de setup (para evitar repetição e garantir consistência)
const setupTransaction = async () => {
    await prisma.user.create({ data: user })
    const txDate = dayjs.utc(transaction.date).startOf('day').toDate()
    await prisma.transaction.create({
        data: { ...transaction, user_id: user.id, date: txDate },
    })
    return txDate // Retorna a data normalizada
}

describe('PostgresDeleteTransactionRepository', () => {
    const from = '2023-01-01'
    const to = '2024-12-31'

    // 1. Deve deletar uma transação com sucesso
    it('should get transaction by user id on db', async () => {
        const date = '2023-06-15T12:00:00Z'
        const sut = new PostgresGetTransactionsByUserIdRepository()
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, date, user_id: user.id },
        })

        const result = await sut.execute(user.id, from, to)

        expect(result.length).toBe(1)
        expect(result[0].name).toBe(transaction.name)
        expect(result[0].amount.toString()).toBe(transaction.amount.toString())
        expect(result[0].type).toBe(transaction.type)
        expect(result[0].user_id).toBe(user.id)

        expect(dayjs(result[0].date).daysInMonth()).toBe(
            dayjs(date).daysInMonth(),
        )

        expect(dayjs(result[0].date).month()).toBe(dayjs(date).month())

        expect(dayjs(result[0].date).year()).toBe(dayjs(date).year())
    })
    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetTransactionsByUserIdRepository()
        const prismaSpy = import.meta.jest.spyOn(prisma.transaction, 'findMany')
        await sut.execute(user.id, from, to)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: user.id,
                date: {
                    gte: from,
                    lte: to,
                },
            },
        })
    })
    it('should delete a user transaction successfully', async () => {
        const txDate = await setupTransaction() // Chama a função de setup

        const sut = new PostgresDeleteTransactionRepository()
        const result = await sut.execute(transaction.id)

        // Verificações
        expect(result.name).toBe(transaction.name)
        expect(result.amount.toString()).toBe(transaction.amount.toString())
        expect(result.type).toBe(transaction.type)
        expect(result.user_id).toBe(user.id)

        // Compara a data no formato 'YYYY-MM-DD' em UTC
        expect(dayjs.utc(result.date).format('YYYY-MM-DD')).toBe(
            dayjs.utc(txDate).format('YYYY-MM-DD'),
        )
        // Compara se as datas são o mesmo dia
        expect(dayjs.utc(result.date).isSame(dayjs.utc(txDate), 'day')).toBe(
            true,
        )
    })

    // 2. Deve lançar TransactionNotFoundError se a transação não existir
    it('should throw TransactionNotFoundError if transaction does not exist', async () => {
        const sut = new PostgresDeleteTransactionRepository()

        // O teste espera que a execução lance a exceção
        await expect(sut.execute('non-existing-id')).rejects.toThrow(
            TransactionNotFoundError,
        )
    })

    // 3. Deve chamar o Prisma com os valores corretos (garantindo setup)
    it('should call Prisma with correct params', async () => {
        await setupTransaction() // Garante que a transação exista

        const prismaSpy = import.meta.jest.spyOn(prisma.transaction, 'delete')
        const sut = new PostgresDeleteTransactionRepository()
        await sut.execute(transaction.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: { id: transaction.id },
        })
    })

    // 4. Deve re-lançar o erro se o Prisma lançar um erro diferente de 'P2025'
    it('should re-throw error if prisma throws a non-P2025 error', async () => {
        // Não é necessário o setup, pois estamos mockando a falha
        const sut = new PostgresDeleteTransactionRepository()
        const prismaError = new Error('Prisma database failure') // Erro customizado

        // Mock para que o Prisma lance um erro genérico
        import.meta.jest
            .spyOn(prisma.transaction, 'delete')
            .mockRejectedValueOnce(prismaError)

        // O teste espera que a execução re-lance o erro
        await expect(sut.execute(transaction.id)).rejects.toThrow(prismaError)
    })
})
