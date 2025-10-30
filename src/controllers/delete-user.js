import {
    serverError,
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    userNotFoundResponse,
} from './helpers/index.js'

export class DeleteUserController {
    constructor(deleteUserUseCase) {
        this.deleteUserUseCase = deleteUserUseCase
    }
    async exceute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            const isIsValid = checkIfIdIsValid(userId)
            if (!isIsValid) {
                return invalidIdResponse()
            }
            const deletedUser = await this.deleteUserUseCase.execute(userId)
            if (!deletedUser) {
                return userNotFoundResponse()
            }
            return ok(deletedUser)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
