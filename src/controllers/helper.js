export const badRequest = (body) => ({
    statusCode: 400,
        body
})
export const created = (body) => ({
    statusCode: 201,
        body
})
export const serverError = () => ({
     statusCode: 500,
        body: {
            errorMessage: 'Internal server error'
    }
})

export const ok = (body) => ({
    statusCode: 200,
        body
})

export const notFoud = (body) => ({
    statusCode: 404,
    body
})