import { EmailAlreadyInUseError } from '../../errors/user.js'
import {
    checkIfEmailIsValid,
    emailIsAlreadyInUseResponse,
    invalidPasswordResponse,
    badRequest,
    serverError,
    created,
    checkIfPasswordIsValid,
} from '../helpers/index.js'
export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }
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
            const passwordIsValid = checkIfPasswordIsValid(params.password)
            if (!passwordIsValid) {
                return invalidPasswordResponse()
            }
            const eamilIsValidd = checkIfEmailIsValid(params.email)
            if (!eamilIsValidd) {
                return emailIsAlreadyInUseResponse()
            }
            const createdUser = await this.createUserUseCase.execute(params)
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
