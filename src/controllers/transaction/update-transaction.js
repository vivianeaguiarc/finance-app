import { updateTransactionSchema } from '../../schemas/transaction.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    mapErrorToHttpResponse,
} from '../helpers/index.js'

export class UpdateTransactionController {
    constructor(updateTransactionUseCase) {
        this.updateTransactionUseCase = updateTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const idIsValid = checkIfIdIsValid(httpRequest.params.transactionId)
            if (!idIsValid) {
                return invalidIdResponse()
            }

            const { user_id, ...params } = httpRequest.body

            await updateTransactionSchema.parseAsync(params)

            const transaction = await this.updateTransactionUseCase.execute(
                httpRequest.params.transactionId,
                { ...params, user_id },
            )

            return ok(transaction, 'Transaction updated successfully')
        } catch (error) {
            return mapErrorToHttpResponse(error)
        }
    }
}
