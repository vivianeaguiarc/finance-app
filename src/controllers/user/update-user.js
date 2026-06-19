import {
    EmailAlreadyInUseError,
    ForbiddenError,
    UserNotFoundError,
} from '../../errors/user.js'
import { updatedUserSchema } from '../../schemas/user.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    badRequest,
    ok,
    serverError,
    userNotFoundResponse,
    forbidden,
    sanitizeUser,
} from '../helpers/index.js'
import { ZodError } from 'zod'

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

            return ok(sanitizeUser(updatedUser))
        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(error)
            }

            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }

            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }
            if (error instanceof ForbiddenError) {
                return forbidden()
            }

            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            return serverError({
                message: 'An unexpected error occurred.',
            })
        }
    }
}
