export function sendHttpResponse(res, { statusCode, body }) {
    if (statusCode === 204) {
        return res.status(204).send()
    }

    const payload =
        body &&
        typeof body === 'object' &&
        body.success === false &&
        res.locals.requestId
            ? { ...body, requestId: res.locals.requestId }
            : body

    return res.status(statusCode).json(payload)
}
