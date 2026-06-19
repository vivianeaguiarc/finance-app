import { createInstallmentTransactionSchema } from '../../schemas/transaction-finance.js'
import {
    created,
    mapErrorToHttpResponse,
    userNotFoundResponse,
} from '../helpers/index.js'
import {
    CategoryForbiddenError,
    CategoryNotFoundError,
    UserNotFoundError,
} from '../../errors/index.js'
import { InvalidInstallmentError } from '../../errors/transaction-finance.js'

export class CreateInstallmentTransactionController {
    constructor(createInstallmentTransactionUseCase) {
        this.createInstallmentTransactionUseCase =
            createInstallmentTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const body = await createInstallmentTransactionSchema.parseAsync(
                httpRequest.body,
            )

            const result =
                await this.createInstallmentTransactionUseCase.execute(
                    httpRequest.userId,
                    body,
                )

            return created(
                result,
                'Installment transactions created successfully',
            )
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            if (
                error instanceof CategoryNotFoundError ||
                error instanceof CategoryForbiddenError ||
                error instanceof InvalidInstallmentError
            ) {
                return mapErrorToHttpResponse(error, httpRequest)
            }

            return mapErrorToHttpResponse(error, httpRequest)
        }
    }
}
