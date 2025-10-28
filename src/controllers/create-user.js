import { CreateUserUseCase } from '../use-cases/create-user.js'
import validator from 'validator'
import { badRequest, serverError, created } from './helper.js'
import { EmailAlreadyInUseError } from '../errors/user.js'
export class CreateUserController {
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]
            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badRequest({ message: `Missing field: ${field}` })
                }
            }
            const passwordIsValid = params.password.length >= 6
            if (!passwordIsValid) {
                return badRequest({
                    message: 'Password must be at least 6 characters long.',
                })
            }
            const eamilIsValidd = validator.isEmail(params.email)
            if (!eamilIsValidd) {
                return badRequest({
                    message:
                        'Invalid email format. Please provide a valid email address.',
                })
            }
            const createUserUseCase = new CreateUserUseCase()
            const createdUser = await createUserUseCase.execute(params)
            return created(createdUser)
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }
            console.error(error)
            return serverError()
        }
    }
}
