export class GetTransactionBalanceUseCase {
    constructor(getTransactionBalanceRepository) {
        this.getTransactionBalanceRepository = getTransactionBalanceRepository
    }

    async execute(userId) {
        return this.getTransactionBalanceRepository.execute(userId)
    }
}
