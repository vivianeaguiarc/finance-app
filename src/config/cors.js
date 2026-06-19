const DEV_ORIGINS = ['http://localhost:3000', 'http://localhost:5173']

export function getAllowedOrigins() {
    const frontendUrl = process.env.FRONTEND_URL

    if (process.env.NODE_ENV === 'production') {
        return frontendUrl ? [frontendUrl] : []
    }

    return [...DEV_ORIGINS, frontendUrl].filter(Boolean)
}

export function getCorsOptions() {
    if (process.env.NODE_ENV === 'test') {
        return {}
    }

    const allowedOrigins = getAllowedOrigins()

    return {
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true)
                return
            }

            callback(new Error('Not allowed by CORS'))
        },
    }
}
