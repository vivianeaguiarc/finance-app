import { CORS_FORBIDDEN_MESSAGE } from '../config/cors.js'

export function logInternalError(error) {
    if (process.env.NODE_ENV !== 'production') {
        console.error(error)
    }
}

export function errorHandler(error, req, res, next) {
    logInternalError(error)

    if (error.message === CORS_FORBIDDEN_MESSAGE) {
        return res.status(403).json({ message: CORS_FORBIDDEN_MESSAGE })
    }

    return res.status(500).json({ message: 'Internal server error' })
}
