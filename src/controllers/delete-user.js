import { DeleteUserUseCase } from '../use-cases/index.js'
import { invalidIdResponse, serverError, checkIfIdIsValid, ok, userNotFoundResponse } from './helpers/index.js';

export class DeleteUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            const isValid = checkIfIdIsValid(userId)
            if (!isValid) {
                return invalidIdResponse()
            }
            const deleteUserUseCase = new DeleteUserUseCase()
            const deletedUser = await deleteUserUseCase.execute(userId)
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
