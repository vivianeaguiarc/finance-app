import { ok, mapErrorToHttpResponse } from '../helpers/index.js'

export class LogoutAllSessionsController {
    constructor(logoutAllSessionsUseCase) {
        this.logoutAllSessionsUseCase = logoutAllSessionsUseCase
    }

    async execute(httpRequest) {
        try {
            await this.logoutAllSessionsUseCase.execute(httpRequest.userId)

            return ok(null, 'All sessions revoked successfully')
        } catch (error) {
            return mapErrorToHttpResponse(error, httpRequest)
        }
    }
}
