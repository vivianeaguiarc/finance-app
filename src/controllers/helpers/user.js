import { badRequest, notFound } from './http.js'

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

export const userNotFoundResponse = () => {
    return notFound({
        message: 'User not found.',
    })
}
