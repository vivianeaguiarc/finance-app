import { createRecurringTransactionSchema } from '../../schemas/transaction-finance.js'
import {
    created,
    ok,
    mapErrorToHttpResponse,
    userNotFoundResponse,
} from '../helpers/index.js'
import {
    CategoryForbiddenError,
    CategoryNotFoundError,
    UserNotFoundError,
} from '../../errors/index.js'
import { InvalidRecurrenceError } from '../../errors/transaction-finance.js'

export class CreateRecurringTransactionController {
    constructor(createRecurringTransactionUseCase) {
        this.createRecurringTransactionUseCase =
            createRecurringTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const body = await createRecurringTransactionSchema.parseAsync(
                httpRequest.body,
            )

            const result = await this.createRecurringTransactionUseCase.execute(
                httpRequest.userId,
                body,
            )

            return created(
                result,
                'Recurring transactions created successfully',
            )
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            if (
                error instanceof CategoryNotFoundError ||
                error instanceof CategoryForbiddenError ||
                error instanceof InvalidRecurrenceError
            ) {
                return mapErrorToHttpResponse(error, httpRequest)
            }

            return mapErrorToHttpResponse(error, httpRequest)
        }
    }
}

export class ListRecurringTransactionsController {
    constructor(listRecurringTransactionsUseCase) {
        this.listRecurringTransactionsUseCase = listRecurringTransactionsUseCase
    }

    async execute(httpRequest) {
        try {
            const items = await this.listRecurringTransactionsUseCase.execute(
                httpRequest.userId,
            )

            return ok(items, 'Recurring transactions retrieved successfully')
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            return mapErrorToHttpResponse(error, httpRequest)
        }
    }
}
