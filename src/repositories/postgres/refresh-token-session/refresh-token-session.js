import { prisma } from '../../../../prisma/prisma.js'

export class PostgresRefreshTokenSessionRepository {
    async create({ id, userId, tokenHash, expiresAt }) {
        return prisma.refreshTokenSession.create({
            data: {
                id,
                user_id: userId,
                token_hash: tokenHash,
                expires_at: expiresAt,
            },
        })
    }

    async findById(sessionId) {
        return prisma.refreshTokenSession.findUnique({
            where: { id: sessionId },
        })
    }

    async revoke(sessionId, replacedByTokenId = null) {
        return prisma.refreshTokenSession.update({
            where: { id: sessionId },
            data: {
                revoked_at: new Date(),
                replaced_by_token_id: replacedByTokenId,
            },
        })
    }

    async revokeAllByUserId(userId) {
        return prisma.refreshTokenSession.updateMany({
            where: {
                user_id: userId,
                revoked_at: null,
            },
            data: {
                revoked_at: new Date(),
            },
        })
    }
}
