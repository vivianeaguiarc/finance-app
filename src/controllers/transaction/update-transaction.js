import { updateTransactionSchema } from '../../schemas/transaction.js'
import { checkIfIdIsValid, invalidIdResponse, ok } from '../helpers/index.js'
import { TransactionNotFoundError } from '../../errors/index.js'

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
            // refatorado aqui
            const { user_id, ...params } = httpRequest.body

            await updateTransactionSchema.parseAsync(params)

            const transaction = await this.updateTransactionUseCase.execute(
                httpRequest.params.transactionId,
                { ...params, user_id },
            )
            // refatorado aqui
            return ok(transaction)
        } catch (error) {
            if (error?.issues) {
                return {
                    statusCode: 400,
                    body: { error: 'ValidationError', details: error.issues },
                }
            }

            if (error instanceof TransactionNotFoundError) {
                return {
                    statusCode: 404,
                    body: {
                        error: 'TransactionNotFound',
                        message: error.message,
                    },
                }
            }

            console.error(error)
            return {
                statusCode: 500,
                body: { error: 'InternalServerError' },
            }
        }
    }
}
