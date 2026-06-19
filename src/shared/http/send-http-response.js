export function sendHttpResponse(res, response) {
    if (response?.isBinary) {
        res.status(response.statusCode)
        res.setHeader('Content-Type', response.contentType)

        if (response.contentDisposition) {
            res.setHeader('Content-Disposition', response.contentDisposition)
        }

        return res.send(response.body)
    }

    const { statusCode, body } = response

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
