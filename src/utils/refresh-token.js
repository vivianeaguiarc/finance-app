import { randomBytes } from 'node:crypto'

const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function parseRefreshToken(refreshToken) {
    if (typeof refreshToken !== 'string' || !refreshToken.includes('.')) {
        return null
    }

    const separatorIndex = refreshToken.indexOf('.')
    const sessionId = refreshToken.slice(0, separatorIndex)
    const secret = refreshToken.slice(separatorIndex + 1)

    if (!UUID_PATTERN.test(sessionId) || !secret) {
        return null
    }

    return { sessionId, secret }
}

export function buildRefreshToken(sessionId, secret) {
    return `${sessionId}.${secret}`
}

export function generateRefreshTokenSecret() {
    return randomBytes(32).toString('base64url')
}

export function getRefreshTokenExpiryDate() {
    const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    const match = expiresIn.match(/^(\d+)([smhd])$/)

    if (!match) {
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }

    const amount = Number(match[1])
    const unit = match[2]
    const multipliers = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
    }

    return new Date(Date.now() + amount * multipliers[unit])
}
