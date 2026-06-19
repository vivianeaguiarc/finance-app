export const errorResponse = (statusCode, message, code) => ({
    statusCode,
    body: {
        success: false,
        message,
        code,
    },
})

export const ok = (data, message = 'Operation completed successfully') => ({
    statusCode: 200,
    body: {
        success: true,
        message,
        data,
    },
})

export const okPaginated = (
    data,
    meta,
    message = 'Operation completed successfully',
) => ({
    statusCode: 200,
    body: {
        success: true,
        message,
        data,
        meta,
    },
})

export const created = (data, message = 'Resource created successfully') => ({
    statusCode: 201,
    body: {
        success: true,
        message,
        data,
    },
})

export const noContent = () => ({
    statusCode: 204,
    body: null,
})

export const badRequest = (message, code = 'BAD_REQUEST') =>
    errorResponse(400, message, code)

export const unauthorized = (
    message = 'Invalid email or password',
    code = 'INVALID_CREDENTIALS',
) => errorResponse(401, message, code)

export const forbidden = (
    message = 'You do not have permission to perform this action.',
    code = 'FORBIDDEN',
) => errorResponse(403, message, code)

export const notFound = (message = 'Resource not found.', code = 'NOT_FOUND') =>
    errorResponse(404, message, code)

export const conflict = (message, code = 'CONFLICT') =>
    errorResponse(409, message, code)

export const tooManyRequests = (
    message = 'Too many requests, please try again later.',
    code = 'TOO_MANY_REQUESTS',
) => errorResponse(429, message, code)

export const serverError = (
    message = 'Internal server error',
    code = 'INTERNAL_ERROR',
) => errorResponse(500, message, code)

export const fileDownload = (body, contentType, filename) => ({
    statusCode: 200,
    contentType,
    contentDisposition: `attachment; filename="${filename}"`,
    body,
    isBinary: true,
})
