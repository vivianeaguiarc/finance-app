export function sendHttpResponse(res, { statusCode, body }) {
    if (statusCode === 204) {
        return res.status(204).send()
    }

    return res.status(statusCode).json(body)
}
