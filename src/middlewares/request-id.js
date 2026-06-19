import { randomUUID } from 'node:crypto'

export const REQUEST_ID_HEADER = 'x-request-id'

export function requestIdMiddleware(req, res, next) {
    const incomingId = req.headers[REQUEST_ID_HEADER]
    const requestId =
        typeof incomingId === 'string' && incomingId.trim()
            ? incomingId.trim()
            : randomUUID()

    req.id = requestId
    res.locals.requestId = requestId
    res.setHeader(REQUEST_ID_HEADER, requestId)

    next()
}
