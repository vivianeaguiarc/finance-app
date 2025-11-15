import {
    serverError,
    ok,
    badRequest,
    unauthorized,
    notFound,
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

            return ok(user)
        } catch (error) {
            // 400 - payload inválido
            if (error instanceof ZodError) {
                return badRequest({ message: error.issues[0].message })
            }

            // 401 - senha inválida
            if (error instanceof InvalidPasswordError) {
                return unauthorized(error.message)
            }

            // 404 - usuário não encontrado
            if (error instanceof UserNotFoundError) {
                return notFound(error.message)
            }

            // 500 - erro inesperado
            console.error('🔥 LOGIN ERROR:', error)
            return serverError()
        }
    }
}
