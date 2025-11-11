import { ok, serverError } from '../helpers/index.js'

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
            console.error('❌ Erro ao buscar saldo de transações:', error)
            return serverError()
        }
    }
}
