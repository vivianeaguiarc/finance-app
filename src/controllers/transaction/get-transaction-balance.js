import { ok, serverError } from '../helpers/index.js'
import { logInternalError } from '../../middlewares/error-handler.js'

export class GetTransactionBalanceController {
    constructor(getTransactionBalanceUseCase) {
        this.getTransactionBalanceUseCase = getTransactionBalanceUseCase
    }

    async execute(httpRequest) {
        try {
            const { userId } = httpRequest.params
            const result =
                await this.getTransactionBalanceUseCase.execute(userId)
            return ok(result)
        } catch (error) {
            logInternalError(error)
            return serverError()
        }
    }
}
