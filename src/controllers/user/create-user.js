import { EmailAlreadyInUseError } from '../../errors/user.js'
import {
    badRequest,
    serverError,
    created,
    sanitizeUserWithTokens,
} from '../helpers/index.js'
import { ZodError } from 'zod'
import { createdUserSchema } from '../../schemas/index.js'
export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            await createdUserSchema.parseAsync(params)
            const createdUser = await this.createUserUseCase.execute(params)
            return created(sanitizeUserWithTokens(createdUser))
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.message,
                })
            }
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }
            if (process.env.NODE_ENV !== 'production') {
                console.error(error)
            }
            return serverError()
        }
    }
}
