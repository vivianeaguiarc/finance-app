import { notFound } from './http.js'

export const userNotFoundResponse = () =>
    notFound('User not found.', 'USER_NOT_FOUND')
