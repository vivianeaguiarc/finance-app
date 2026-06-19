// import { ForbiddenError } from '../../errors/index.js'

// export class UpdateTransactionUseCase {
//     constructor(updateTransactionRepository, getTransactionByIdRepository) {
//         this.updateTransactionRepository = updateTransactionRepository
//         this.getTransactionByIdRepository = getTransactionByIdRepository
//     }
//     async execute(transactionId, params) {
//         const transaction =
//             await this.getTransactionByIdRepository.execute(transactionId)
//         if (params.user_id && transaction.user_id !== params.user_id) {
//             throw new ForbiddenError()
//         }
//         return this.updateTransactionRepository.execute(transactionId, params)
//     }
// }

import { ForbiddenError } from '../../errors/index.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'

export class UpdateTransactionUseCase {
    constructor(
        updateTransactionRepository,
        getTransactionByIdRepository,
        cacheService = null,
    ) {
        this.updateTransactionRepository = updateTransactionRepository
        this.getTransactionByIdRepository = getTransactionByIdRepository
        this.cacheService = cacheService
    }

    async execute(transactionId, params) {
        const { user_id, ...updateData } = params

        const transaction =
            await this.getTransactionByIdRepository.execute(transactionId)

        if (!transaction) {
            throw new TransactionNotFoundError(transactionId)
        }

        if (transaction.user_id !== user_id) {
            throw new ForbiddenError()
        }

        const updatedTransaction =
            await this.updateTransactionRepository.execute(
                transactionId,
                updateData,
            )

        if (this.cacheService) {
            await this.cacheService.invalidateUserCache(user_id)
        }

        return updatedTransaction
    }
}
