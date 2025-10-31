import { UserNotFoundError } from '../../errors/user.js'

export class UpdateTransactionUseCase {
    constructor(updateTransactionRepository, getUserByIdRepository) {
        this.updateTransactionRepository = updateTransactionRepository
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(params) {
        const user = await this.getUserByIdRepository.execute(params.userId)
        if (!user) throw new UserNotFoundError('User not found')

        const transaction = await this.updateTransactionRepository.execute(
            user.id,
            params,
        )
        return transaction
    }
}
