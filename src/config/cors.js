export const CORS_FORBIDDEN_MESSAGE = 'Origin not allowed by CORS policy'

const DEV_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://localhost:5174',
]

export function getAllowedOrigins() {
    const frontendUrl = process.env.FRONTEND_URL

    if (process.env.NODE_ENV === 'production') {
        return frontendUrl ? [frontendUrl] : []
    }

    return [...DEV_ORIGINS, frontendUrl].filter(Boolean)
}

export function isOriginAllowed(origin) {
    if (!origin) {
        return true
    }

    return getAllowedOrigins().includes(origin)
}

export function getCorsOptions() {
    if (process.env.NODE_ENV === 'test') {
        return {}
    }

    return {
        origin(origin, callback) {
            if (isOriginAllowed(origin)) {
                callback(null, true)
                return
            }

            callback(new Error(CORS_FORBIDDEN_MESSAGE))
        },
        credentials: true,
    }
}
