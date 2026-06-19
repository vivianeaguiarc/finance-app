export const badRequest = (body) => ({
    statusCode: 400,
    body,
})
export const noContent = () => ({
    statusCode: 204,
    body: null,
})

export const unauthorized = (
    body = { message: 'Invalid email or password' },
) => ({
    statusCode: 401,
    body: typeof body === 'string' ? { message: body } : body,
})
export const forbidden = () => ({
    statusCode: 403,
    body: { message: 'Forbidden' },
})

export const created = (body) => ({
    statusCode: 201,
    body,
})

export const serverError = () => ({
    statusCode: 500,
    body: { error: 'Internal server error' },
})
export const ok = (body) => ({
    statusCode: 200,
    body,
})

export const notFound = (body) => ({
    statusCode: 404,
    body,
})
