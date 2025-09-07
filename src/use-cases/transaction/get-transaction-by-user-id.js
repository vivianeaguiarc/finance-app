import { UserNotFoundError } from '../../errors/user.js'

export class GetTransactionsByUserId {
  constructor(getTransactionsByUserIdRepository, getUserByIdRepository) {
    this.getTransactionsByUserIdRepository = getTransactionsByUserIdRepository
    this.getUserByIdRepository = getUserByIdRepository
  }
  async excecute(params) {
    const user = await this.getUserByIdRepository.excecute(params.userId)
    if (!user) {
      throw new UserNotFoundError(params.userId)
    }
    const transactions = await this.getTransactionsByUserIdRepository.excecute(params.userId)
    return transactions
  }
}
