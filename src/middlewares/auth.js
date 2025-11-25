import jwt from 'jsonwebtoken'

export const auth = (request, response, next) => {
    try {
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

        request.userId = decodedToken.userid
        next()
    } catch (error) {
        console.error('Erro na autenticação:', error)
        return response.status(401).send({ error: 'Unauthorized' })
    }
}
