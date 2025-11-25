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

            const params = httpRequest.body

            await updatedUserSchema.parseAsync(params)

            const updatedUser = await this.updateUserUseCase.execute(
                userId,
                params,
            )

            // 🚀 REMOVER SENHA DA RESPOSTA
            if (updatedUser.password) {
                delete updatedUser.password
            }

            return ok(updatedUser)
        } catch (error) {
            console.error(error)

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
