import { getTransactionsByUserIdSchema } from '../../schemas/transaction.js'
import {
    ok,
    userNotFoundResponse,
    mapErrorToHttpResponse,
} from '../helpers/index.js'
import { UserNotFoundError } from '../../errors/index.js'

export class GetTransactionByUserIdController {
    constructor(getTransactionByUserIdUseCase) {
        this.getTransactionByUserIdUseCase = getTransactionByUserIdUseCase
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest.userId
            const { from, to } = httpRequest.query

            await getTransactionsByUserIdSchema.parse({
                userId,
                from,
                to,
            })

            const transactions =
                await this.getTransactionByUserIdUseCase.execute(
                    userId,
                    from,
                    to,
                )

            return ok(transactions, 'Transactions retrieved successfully')
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            return mapErrorToHttpResponse(error)
        }
    }
}
