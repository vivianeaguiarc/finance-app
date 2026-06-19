import {
    ok,
    unauthorized,
    sanitizeUserWithTokens,
    mapErrorToHttpResponse,
} from '../helpers/index.js'
import { loginSchema } from '../../schemas/index.js'
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

            return ok(sanitizeUserWithTokens(user), 'Login successful')
        } catch (error) {
            if (
                error instanceof InvalidPasswordError ||
                error instanceof UserNotFoundError
            ) {
                return unauthorized()
            }

            return mapErrorToHttpResponse(error)
        }
    }
}
