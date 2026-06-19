import { listTransactionsQuerySchema } from '../../schemas/transaction.js'
import {
    okPaginated,
    userNotFoundResponse,
    mapErrorToHttpResponse,
} from '../helpers/index.js'
import { UserNotFoundError } from '../../errors/index.js'
import { buildPaginationMeta } from '../../utils/transaction-query.js'

export class GetTransactionByUserIdController {
    constructor(getTransactionByUserIdUseCase) {
        this.getTransactionByUserIdUseCase = getTransactionByUserIdUseCase
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest.userId
            const { userId: _ignoredUserId, ...queryParams } =
                httpRequest.query ?? {}

            const query = await listTransactionsQuerySchema.parseAsync({
                ...queryParams,
                userId,
            })

            const { items, total } =
                await this.getTransactionByUserIdUseCase.execute(
                    userId,
                    query,
                )

            const meta = buildPaginationMeta(query.page, query.limit, total)

            return okPaginated(
                items,
                meta,
                'Transactions retrieved successfully',
            )
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            return mapErrorToHttpResponse(error)
        }
    }
}
