import { ZodError } from 'zod'
import { createdTransactionSchema } from '../../schemas/transaction.js'
import {
    badRequest,
    created,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js'

import { UserNotFoundError } from '../../errors/user.js'
import { logInternalError } from '../../middlewares/error-handler.js'
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
            return created(transaction)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            logInternalError(error)
            return serverError()
        }
    }
}
