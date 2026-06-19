import { createdTransactionSchema } from '../../schemas/transaction.js'
import {
    created,
    userNotFoundResponse,
    mapErrorToHttpResponse,
} from '../helpers/index.js'
import { UserNotFoundError } from '../../errors/user.js'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            await createdTransactionSchema.parseAsync(params)

            const transaction =
                await this.createTransactionUseCase.execute(params)
            return created(transaction, 'Transaction created successfully')
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            return mapErrorToHttpResponse(error)
        }
    }
}
