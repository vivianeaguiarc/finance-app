import {
    checkIfIdIsValid,
    invalidIdResponse,
    userNotFoundResponse,
    noContent,
    forbidden,
    mapErrorToHttpResponse,
} from '../helpers/index.js'
import { UserNotFoundError } from '../../errors/user.js'

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

            if (httpRequest.userId && userId !== httpRequest.userId) {
                return forbidden()
            }

            await this.deleteUserUseCase.execute(userId)

            return noContent()
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            return mapErrorToHttpResponse(error, httpRequest)
        }
    }
}
