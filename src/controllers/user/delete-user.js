import {
    serverError,
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    userNotFoundResponse,
} from '../helpers/index.js'
import { UserNotFoundError } from '../../errors/user.js' // << classe de erro

export class DeleteUserController {
    constructor(deleteUserUseCase) {
        this.deleteUserUseCase = deleteUserUseCase
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest?.params?.userId
            const isValid = checkIfIdIsValid(userId)
            if (!isValid) {
                return invalidIdResponse()
            }

            const deletedUser = await this.deleteUserUseCase.execute(userId)

            // caso o use case "resolva" com um erro (como no teste)
            if (deletedUser instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            return ok(deletedUser)
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            console.error(error)
            return serverError()
        }
    }
}
