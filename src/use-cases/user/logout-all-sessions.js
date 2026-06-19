export class LogoutAllSessionsUseCase {
    constructor(authTokenService) {
        this.authTokenService = authTokenService
    }

    async execute(userId) {
        await this.authTokenService.revokeAllUserSessions(userId)
    }
}
