export const ensureSelf = (request, response, next) => {
    const requestedUserId = request.params?.userId

    if (requestedUserId && requestedUserId !== request.userId) {
        return response.status(403).send({ message: 'Forbidden' })
    }

    next()
}
