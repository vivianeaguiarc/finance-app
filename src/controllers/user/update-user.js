import { updatedUserSchema } from '../../schemas/user.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    forbidden,
    sanitizeUser,
    mapErrorToHttpResponse,
} from '../helpers/index.js'

export class UpdateUserController {
    constructor(updateUserUseCase) {
        this.updateUserUseCase = updateUserUseCase
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            const isIdValid = checkIfIdIsValid(userId)

            if (!isIdValid) {
                return invalidIdResponse()
            }

            if (httpRequest.userId && userId !== httpRequest.userId) {
                return forbidden()
            }

            const params = httpRequest.body
            await updatedUserSchema.parseAsync(params)

            const updatedUser = await this.updateUserUseCase.execute(
                userId,
                params,
            )

            return ok(sanitizeUser(updatedUser), 'User updated successfully')
        } catch (error) {
            return mapErrorToHttpResponse(error)
        }
    }
}
