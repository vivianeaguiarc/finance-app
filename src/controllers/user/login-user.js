import {
    serverError,
    ok,
    badRequest,
    unauthorized,
    sanitizeUserWithTokens,
} from '../helpers/index.js'

import { loginSchema } from '../../schemas/index.js'
import { ZodError } from 'zod'
import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.js'

export class LoginUserController {
    constructor(loginUserUseCase) {
        this.loginUserUseCase = loginUserUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            await loginSchema.parseAsync(params)

            const user = await this.loginUserUseCase.execute(
                params.email,
                params.password,
            )

            return ok(sanitizeUserWithTokens(user))
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({ message: error.issues[0].message })
            }

            if (
                error instanceof InvalidPasswordError ||
                error instanceof UserNotFoundError
            ) {
                return unauthorized()
            }

            if (process.env.NODE_ENV !== 'production') {
                console.error(error)
            }
            return serverError()
        }
    }
}
