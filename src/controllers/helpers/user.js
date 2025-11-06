import { notFound } from './http.js'

export const userNotFoundResponse = () => {
    return notFound({
        message: 'User not found.',
    })
}
