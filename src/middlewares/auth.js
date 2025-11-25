import jwt from 'jsonwebtoken'

export const auth = (request, response, next) => {
    try {
        console.log('AUTH HEADER RECEBIDO:', request.headers.authorization)

        const accessToken = request.headers?.authorization?.split('Bearer ')[1]

        if (!accessToken) {
            return response.status(401).send({ error: 'Unauthorized' })
        }

        const decodedToken = jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_SECRET,
        )

        if (!decodedToken) {
            return response.status(401).send({ error: 'Unauthorized' })
        }

        request.userId = decodedToken.userId
        next()
    } catch (error) {
        return response.status(401).send({ error: 'Unauthorized' })
    }
}
