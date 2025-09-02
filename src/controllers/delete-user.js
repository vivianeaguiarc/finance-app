import {
    invalidIdResponse,
    serverError,
    checkIfIdIsValid,
    ok,
    userNotFoundResponse,
} from './helpers/index.js'

export class DeleteUserController {
    constructor(deleteUserUseCase) {
        this.deleteUserUseCase = deleteUserUseCase
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            const isValid = checkIfIdIsValid(userId)
            if (!isValid) {
                return invalidIdResponse()
            }
            const deletedUser = await this.deleteUserUseCase.execute(userId)
            if (!deletedUser) {
                return userNotFoundResponse()
            }
            return ok(deletedUser)
        } catch (error) {
            console.log(error)
            return serverError(error)
        }
    }
}
