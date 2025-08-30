import { UpdateUserUseCase } from '../use-cases/index.js'
import { badRequest, serverError, ok } from './helpers/http.js'
import {
    checkIfEmailIsValid,
    checkIfIdIsValid,
    checkIfPasswordIsValid,
    emailIsAlreadyInUseResponse,
    invalidIdResponse,
    invalidPasswordResponse,
} from './helpers/user.js'

export class UpdateUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            const isIdValid = checkIfIdIsValid(userId)
            if (!isIdValid) {
                return invalidIdResponse()
            }
            const params = httpRequest.body
            const allowedFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]
            const someFieldsIsNotAllowed = Object.keys(params).some(
                (field) => !allowedFields.includes(field)
            )

            if (someFieldsIsNotAllowed) {
                return badRequest({
                    message: 'Some provided fields is not allowed',
                })
            }
            if (params.password) {
                const passwordIsValid = checkIfPasswordIsValid(params.password)
                if (!passwordIsValid) {
                    return invalidPasswordResponse()
                }
            }
            if (params.email) {
                const emailIsValid = checkIfEmailIsValid(params.email)
                if (!emailIsValid) {
                    return emailIsAlreadyInUseResponse()
                }
            }
            const updateUserUseCase = new UpdateUserUseCase()
            const updatedUser = await updateUserUseCase.execute(userId, params)
            return ok(updatedUser)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
