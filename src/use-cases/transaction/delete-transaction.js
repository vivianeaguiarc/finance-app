import { ForbiddenError, TransactionNotFoundError } from '../../errors/index.js'

export class DeleteTransactionUseCase {
    constructor(deleteTransactionRepository, getTransactionByIdRepository) {
        this.deleteTransactionRepository = deleteTransactionRepository
        this.getTransactionByIdRepository = getTransactionByIdRepository
    }
    async execute(transactionId, userId) {
        const transaction = await this.deleteTransactionRepository.execute(
            transactionId,
            userId,
        )
        if (!transaction) {
            throw new TransactionNotFoundError(transactionId)
        }
        if (transaction.user_id != userId) {
            throw new ForbiddenError()
        }
        const deletedTransaction =
            await this.getTransactionByIdRepository.execute(
                transactionId,
                userId,
            )
        return transaction
    }
}
