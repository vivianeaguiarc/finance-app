import {
  serverError,
  userNotFoundResponse,
  requiredFieldIsMissingResponse,
  ok,
} from '../../helpers/index.js'
import { UserNotFoundError } from '../../errors/user.js'
import { checkIfIdIsValid, invalidIdResponse } from '../../helpers/validation.js'

export class GetTransactionsByUserId {
  constructor(getTransactionsByUserIdUseCase) {
    this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase
  }
  async execute(httpRequest) {
    try {
      const userId = httpRequest.query.userId
      // verificar se o userId foi passado como parametro
      if (!userId) {
        return requiredFieldIsMissingResponse('userId')
      }
      // verificar se um id é valido
      const userIdIsValid = checkIfIdIsValid(userId)
      if (!userIdIsValid) {
        return invalidIdResponse('userId')
      }
      // chamar o use case
      const transactions = await this.getTransactionsByUserIdUseCase.excecute({ userId })
      return ok(transactions)
    } catch (error) {
      console.error(error)
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse()
      }

      return serverError()
    }
  }
}
