// import { prisma } from '../../../../prisma/prisma.js'
// import { UserNotFoundError } from '../../../errors/user.js'
// import { user } from '../../../tests/fixtures/user.js'
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js'

// export class PostgresUpdateTransactionRepository {
//     async execute(transactionId, updateTransactionParams) {
//         try {
//             return await prisma.transaction.update({
//                 where: { id: transactionId },
//                 data: updateTransactionParams,
//             })
//         } catch (error) {
//             if (error instanceof PrismaClientKnownRequestError) {
//                 if (error.code === 'P2025') {
//                     throw new UserNotFoundError(user)
//                 }
//             }
//         }
//     }
// }

// import { prisma } from '../../../../prisma/prisma.js'
// import { TransactionNotFoundError } from '../../../errors/transaction.js'
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js'

// export class PostgresUpdateTransactionRepository {
//     async execute(transactionId, updateTransactionParams) {
//         try {
//             return await prisma.transaction.update({
//                 where: { id: transactionId },
//                 data: updateTransactionParams,
//             })
//         } catch (error) {
//             // Quando não encontra registro para atualizar
//             if (
//                 error instanceof PrismaClientKnownRequestError &&
//                 error.code === 'P2025'
//             ) {
//                 throw new TransactionNotFoundError(transactionId)
//             }
//             // Qualquer outro erro do Prisma deve ser repassado ao teste
//             throw error
//         }
//     }
// }

// src/repositories/postgres/transaction/update-transaction.js
import { prisma } from '../../../../prisma/prisma.js'
import { TransactionNotFoundError } from '../../../errors/transaction.js'

export class PostgresUpdateTransactionRepository {
    async execute(transactionId, updateTransactionParams) {
        try {
            return await prisma.transaction.update({
                where: { id: transactionId },
                data: updateTransactionParams,
            })
        } catch (error) {
            // ✅ não use instanceof; confie no code
            if (error?.code === 'P2025') {
                throw new TransactionNotFoundError(transactionId)
            }
            throw error
        }
    }
}
