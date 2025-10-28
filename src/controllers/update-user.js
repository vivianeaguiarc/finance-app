import { badRequest, ok } from './helper.js'
import validator from 'validator'
import { UpdateUserUseCase } from '../use-cases/update-user.js'
import { EmailAlreadyInUseError } from '../errors/user.js'

export class UpdateUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            const isIdValid = validator.isUUID(userId)
            if (!isIdValid) {
                return badRequest({
                    message: 'Invalid user ID format.',
                })
            }
            const updateUserParams = httpRequest.body

            const allowFields = ['first_name', 'last_name', 'email', 'password']
            const someFieldIsNotAllowed = Object.keys(updateUserParams).some(
                (field) => !allowFields.includes(field),
            )
            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: 'Some fields are not allowed to be updated',
                })
            }
            if (updateUserParams.password) {
                const passwordIsNotValid = updateUserParams.password.length < 6
                if (passwordIsNotValid) {
                    return badRequest({
                        message: 'Password must be at least 6 characters long',
                    })
                }
            }
            if (updateUserParams.email) {
                const emailIsValid = validator.isEmail(updateUserParams.email)
                if (!emailIsValid) {
                    return badRequest({
                        message:
                            'Invalid email format. Please provide a valid email address.',
                    })
                }
            }
            const updateUserUseCase = new UpdateUserUseCase()
            const updatedUser = await updateUserUseCase.execute(
                userId,
                updateUserParams,
            )
            return ok(updatedUser)
        } catch (error) {
            console.error(error)
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }
            return badRequest({
                message: 'An unexpected error occurred.',
            })
        }
    }
}
