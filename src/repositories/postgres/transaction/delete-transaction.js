import pkg from '@prisma/client' // Importa o módulo CommonJS como um objeto padrão (default)
const { PrismaClientKnownRequestError } = pkg // Desestrutura a classe de erro a partir desse objeto
import { prisma } from '../../../../prisma/prisma.js'
import { TransactionNotFoundError } from '../../../errors/index.js'
// ...

export class PostgresDeleteTransactionRepository {
    async execute(transactionId) {
        try {
            return await prisma.transaction.delete({
                where: { id: transactionId },
            })
        } catch (error) {
            // AQUI O CATCH ESTÁ CORRETO
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new TransactionNotFoundError(transactionId)
                }
            }
            throw error
        }
    }
}
