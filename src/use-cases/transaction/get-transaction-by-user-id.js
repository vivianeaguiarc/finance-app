import { UserNotFoundError } from '../../errors/user.js'

export class GetTransactionByUserIdUseCase {
    constructor(getTransactionByUserIdRepository, getUserByIdRepository) {
        this.getTransactionByUserIdRepository = getTransactionByUserIdRepository
        this.getUserByIdRepository = getUserByIdRepository
    }

    async execute(userId, query) {
        const user = await this.getUserByIdRepository.execute(userId)
        if (!user) {
            throw new UserNotFoundError()
        }

        return this.getTransactionByUserIdRepository.execute(userId, query)
    }
}
