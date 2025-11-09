// // teste corrigido
// import { prisma } from '../../../../prisma/prisma.js'
// import dayjs from 'dayjs'
// import utc from 'dayjs/plugin/utc'
// dayjs.extend(utc)

// import { transaction, user } from '../../../tests/fixtures/index.js'
// import { PostgresDeleteTransactionRepository } from './delete-transaction.js'

// describe('PostgresDeleteTransactionRepository', () => {
//     it('should delete a user transaction successfully', async () => {
//         await prisma.user.create({ data: user })

//         // ⚠️ Normaliza a data do fixture para UTC meia-noite (DATE-safe)
//         const txDate = dayjs.utc(transaction.date).startOf('day').toDate()

//         await prisma.transaction.create({
//             data: { ...transaction, user_id: user.id, date: txDate },
//         })

//         const sut = new PostgresDeleteTransactionRepository()
//         const result = await sut.execute(transaction.id)

//         expect(result.name).toBe(transaction.name)
//         expect(result.amount.toString()).toBe(transaction.amount.toString())
//         expect(result.type).toBe(transaction.type)
//         expect(result.user_id).toBe(user.id)

//         // ✅ Compare só AAAA-MM-DD em UTC
//         expect(dayjs.utc(result.date).format('YYYY-MM-DD')).toBe(
//             dayjs.utc(transaction.date).format('YYYY-MM-DD')
//         )

//         // (se preferir isSame, normalize ambos)
//         expect(
//             dayjs.utc(result.date).isSame(dayjs.utc(transaction.date), 'day')
//         ).toBe(true)
//     })
//     it('should return null if transaction does not exist', async () => {
//         const sut = new PostgresDeleteTransactionRepository()
//         const result = await sut.execute('non-existing-id')

//         expect(result).toBeNull()
//     })
//     // Teste 'should call prisma with correct values'

//     it('should call prisma with correct values', async () => {
//         // ⚠️ ADICIONE O SETUP AQUI ⚠️
//         await prisma.user.create({ data: user })
//         const txDate = dayjs.utc(transaction.date).startOf('day').toDate()
//         await prisma.transaction.create({
//             data: { ...transaction, user_id: user.id, date: txDate },
//         })
//         // --------------------------

//         const prismaSpy = jest.spyOn(prisma.transaction, 'delete')
//         const sut = new PostgresDeleteTransactionRepository()
//         await sut.execute(transaction.id)

//         expect(prismaSpy).toHaveBeenCalledWith({
//             where: { id: transaction.id },
//         })
//     })
// })

// import { prisma } from '../../../../prisma/prisma.js'
// import dayjs from 'dayjs'
// import utc from 'dayjs/plugin/utc'
// dayjs.extend(utc)

// import { transaction, user } from '../../../tests/fixtures/index.js'
// import { PostgresDeleteTransactionRepository } from './delete-transaction.js'
// import { TransactionNotFoundError } from '../../../errors/index.js'
// const setupTransaction = async () => {
//     await prisma.user.create({ data: user })
//     const txDate = dayjs.utc(transaction.date).startOf('day').toDate()
//     await prisma.transaction.create({
//         data: { ...transaction, user_id: user.id, date: txDate },
//     })
//     return txDate
// }

// describe('PostgresDeleteTransactionRepository', () => {

//     it('should throw TransactionNotFoundError if transaction does not exist', async () => {
//         const sut = new PostgresDeleteTransactionRepository()
//         await expect(sut.execute('non-existing-id')).rejects.toThrow(
//             TransactionNotFoundError
//         )
//     })
// })
import dayjs from 'dayjs'
import { prisma } from '../../../../prisma/prisma.js'
import { transaction, user } from '../../../tests/fixtures/index.js'
import { PostgresDeleteTransactionRepository } from './delete-transaction.js'

describe('PostgresDeleteTransactionRepository', () => {
    it('should delete atransaction on db', async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const sut = new PostgresDeleteTransactionRepository()
        const result = await sut.execute(transaction.id)

        expect(result.name).toBe(transaction.name)
        expect(result.type).toBe(transaction.type)
        expect(result.user_id).toBe(user.id)
        expect(String(result.amount)).toBe(String(transaction.amount))
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth(),
        )
        expect(dayjs(result.date).month()).toBe(dayjs(transaction.date).month())
        expect(dayjs(result.date).month()).toBe(dayjs(transaction.date).month())
        expect(dayjs(result.date).year()).toBe(dayjs(transaction.date).year())
    })
    it('should call prisma with correct params', async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const prismaSpy = jest.spyOn(prisma.transaction, 'delete')
        const sut = new PostgresDeleteTransactionRepository()
        await sut.execute(transaction.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: { id: transaction.id },
        })
    })
    it('should throw generic error if prisma throws generic error', async () => {
        const sut = new PostgresDeleteTransactionRepository()
        jest.spyOn(prisma.transaction, 'delete').mockRejectedValueOnce(
            new Error(),
        )
        const promise = sut.execute(transaction.id)

        await expect(promise).rejects.toThrow(Error)
    })
})
// import dayjs from 'dayjs'
// import { prisma } from '../../../../prisma/prisma.js'
// import { transaction, user } from '../../../tests/fixtures/index.js'
// import { PostgresDeleteTransactionRepository } from './delete-transaction.js'
// // ⚠️ NECESSÁRIO IMPORTAR O ERRO PARA TESTAR O CENÁRIO DE FALHA ⚠️
// import { TransactionNotFoundError } from '../../../errors/index.js'

// // Função auxiliar de setup, para garantir consistência
// const setupTransaction = async () => {
//     await prisma.user.create({ data: user })
//     await prisma.transaction.create({
//         data: { ...transaction, user_id: user.id },
//     })
// }

// describe('PostgresDeleteTransactionRepository', () => {
//     // 1. Deve deletar uma transação com sucesso (Seu código original, mantido)
//     it('should delete a transaction on db', async () => {
//         await setupTransaction() // Usando a função auxiliar para garantir dados

//         const sut = new PostgresDeleteTransactionRepository()
//         const result = await sut.execute(transaction.id)

//         expect(result.name).toBe(transaction.name)
//         expect(result.type).toBe(transaction.type)
//         expect(result.user_id).toBe(user.id)
//         expect(String(result.amount)).toBe(String(transaction.amount))

//         // (As comparações de Day.js aqui podem ter problemas de fuso horário, mas as mantive se estiverem passando)
//         expect(dayjs(result.date).daysInMonth()).toBe(
//             dayjs(transaction.date).daysInMonth()
//         )
//         expect(dayjs(result.date).month()).toBe(dayjs(transaction.date).month())
//         expect(dayjs(result.date).year()).toBe(dayjs(transaction.date).year())
//     })

//     // 2. Deve chamar o prisma com os parâmetros corretos (SETUP CORRIGIDO)
//     it('should call prisma with correct params', async () => {
//         // 🛑 CORREÇÃO: Cria a transação ANTES de tentar deletá-la
//         await setupTransaction()

//         const prismaSpy = jest.spyOn(prisma.transaction, 'delete')
//         const sut = new PostgresDeleteTransactionRepository()
//         await sut.execute(transaction.id)

//         expect(prismaSpy).toHaveBeenCalledWith({
//             where: { id: transaction.id },
//         })
//     })

//     // 3. ⚠️ TESTE ADICIONAL NECESSÁRIO para cobrir o comportamento do SUT
//     it('should throw TransactionNotFoundError if transaction does not exist', async () => {
//         const sut = new PostgresDeleteTransactionRepository()

//         // Como o repositório lança um erro (devido ao P2025), o teste deve esperar o erro.
//         await expect(sut.execute('non-existing-id')).rejects.toThrow(
//             TransactionNotFoundError
//         )
//     })

//     // 4. (Opcional) Teste para erros inesperados
//     it('should re-throw error if prisma throws an unexpected error', async () => {
//         const sut = new PostgresDeleteTransactionRepository()
//         const prismaError = new Error('Database connection failed')

//         jest.spyOn(prisma.transaction, 'delete').mockRejectedValueOnce(
//             prismaError
//         )

//         await expect(sut.execute(transaction.id)).rejects.toThrow(prismaError)
//     })
// })
