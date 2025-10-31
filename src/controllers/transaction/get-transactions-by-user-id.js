import {
    checkIfIdIsValid,
    invalidIdResponse,
    requiredFieldIsMissingResponse,
    serverError,
    ok,
    userNotFoundResponse,
} from '../helpers/index.js'
import { UserNotFoundError } from '../../errors/user.js'

export class GetTransactionsByUserId {
    constructor(getTransactionsByUserIdUseCase) {
        this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            if (!userId) {
                return requiredFieldIsMissingResponse('userId')
            }
            const userIdIsValid = checkIfIdIsValid(userId)
            if (!userIdIsValid) {
                return invalidIdResponse()
            }
            const transactions =
                await this.getTransactionsByUserIdUseCase.execute({ userId })
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
