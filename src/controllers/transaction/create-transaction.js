import { ZodError } from 'zod'
import { createdTransactionSchema } from '../../schemas/transaction.js'
import { badRequest, created, serverError } from '../helpers/index.js'
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
            console.error(error)
            return serverError()
        }
    }
}
