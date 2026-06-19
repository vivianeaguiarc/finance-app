import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    userNotFoundResponse,
    forbidden,
    sanitizeUser,
} from '../helpers/index.js'

export class GetUserByIdController {
    constructor(getUserByIdUseCase) {
        this.getUserByIdUseCase = getUserByIdUseCase
    }
    async execute(httpRequest) {
        try {
            const isIdValid = checkIfIdIsValid(httpRequest.params.userId)
            if (!isIdValid) {
                return invalidIdResponse()
            }

            if (
                httpRequest.userId &&
                httpRequest.params.userId !== httpRequest.userId
            ) {
                return forbidden()
            }

            const user = await this.getUserByIdUseCase.execute(
                httpRequest.params.userId,
            )
            if (!user) {
                return userNotFoundResponse()
            }
            return ok(sanitizeUser(user))
        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(error)
            }
            return serverError()
        }
    }
}
