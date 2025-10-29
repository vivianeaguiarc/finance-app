import { badRequest } from './http.js'
import validator from 'validator'

export const invalidPasswordResponse = () => {
    return badRequest({
        message:
            'Password must be at least 8 characters long and include a number and a special character.',
    })
}

export const emailIsAlreadyInUseResponse = () => {
    badRequest({
        message:
            'The provided email is already in use. Please use a different email address.',
    })
}

export const invalidIdResponse = () => {
    badRequest({
        message: 'The provided id is not valid.',
    })
}
export const checkIfPasswordIsValid = (password) => password.length >= 6

export const checkIfEmailIsValid = (email) => validator.isEmail(email)
