import {
    serverError,
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    userNotFoundResponse,
} from './helpers/index.js'
import { DeleteUserUseCase } from '../use-cases/index.js'

export class DeleteUserController {
    async exceute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            const isIsValid = checkIfIdIsValid(userId)
            if (!isIsValid) {
                return invalidIdResponse()
            }
            const deleteUserUseCase = new DeleteUserUseCase()
            const deletedUser = await deleteUserUseCase.execute(userId)
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
