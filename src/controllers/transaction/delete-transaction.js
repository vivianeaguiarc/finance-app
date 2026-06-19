import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    mapErrorToHttpResponse,
} from '../helpers/index.js'

export class DeleteTransactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.transactionId
            const userId = httpRequest.params.user_id

            const trnsactionIdIsvalid = checkIfIdIsValid(transactionId)
            const userIdIsvalid = checkIfIdIsValid(userId)
            if (!trnsactionIdIsvalid || !userIdIsvalid) {
                return invalidIdResponse()
            }

            const deletedTransaction =
                await this.deleteTransactionUseCase.execute(
                    transactionId,
                    userId,
                )

            return ok(deletedTransaction, 'Transaction deleted successfully')
        } catch (error) {
            return mapErrorToHttpResponse(error, httpRequest)
        }
    }
}
