import jwt from 'jsonwebtoken'
import { errorResponse } from '../controllers/helpers/http.js'

export const auth = (request, response, next) => {
    try {
        const accessToken = request.headers?.authorization?.split('Bearer ')[1]

        if (!accessToken) {
            const { statusCode, body } = unauthorizedResponse()
            return response.status(statusCode).json(body)
        }

        const decodedToken = jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_SECRET,
        )

        if (!decodedToken) {
            const { statusCode, body } = unauthorizedResponse()
            return response.status(statusCode).json(body)
        }

        request.userId = decodedToken.userId
        next()
    } catch (error) {
        const { statusCode, body } = unauthorizedResponse()
        return response.status(statusCode).json(body)
    }
}

function unauthorizedResponse() {
    return errorResponse(
        401,
        'You must be logged in to perform this action.',
        'UNAUTHORIZED',
    )
}
