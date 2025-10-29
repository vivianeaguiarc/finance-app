import { badRequest } from './http.js'
import validator from 'validator'

export const invalidPasswordResponse = () => {
    return badRequest({
        message: 'Password must be at least 6 characters long.',
    })
}

export const emailIsAlreadyInUseResponse = () => {
    return badRequest({
        message:
            'The provided email is already in use. Please use a different email address.',
    })
}

export const invalidIdResponse = () => {
    return badRequest({
        message: 'The provided id is not valid.',
    })
}
export const userNotFoundResponse = () => {
    return badRequest({
        message: 'User not found.',
    })
}
export const checkIfPasswordIsValid = (password) => password.length >= 6

export const checkIfEmailIsValid = (email) => validator.isEmail(email)

export const checkIfIdIsValid = (id) => validator.isUUID(id)
