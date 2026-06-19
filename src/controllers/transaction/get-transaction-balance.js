import { ok, mapErrorToHttpResponse } from '../helpers/index.js'

export class GetTransactionBalanceController {
    constructor(getTransactionBalanceUseCase) {
        this.getTransactionBalanceUseCase = getTransactionBalanceUseCase
    }

    async execute(httpRequest) {
        try {
            const { userId } = httpRequest.params
            const result =
                await this.getTransactionBalanceUseCase.execute(userId)
            return ok(result, 'Transaction balance retrieved successfully')
        } catch (error) {
            return mapErrorToHttpResponse(error)
        }
    }
}
