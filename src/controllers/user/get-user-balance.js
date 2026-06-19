import {
    ok,
    badRequest,
    serverError,
    userNotFoundResponse,
    forbidden,
} from '../helpers/index.js'
import { ZodError } from 'zod'
import { getUserBalanceSchema } from '../../schemas/index.js'

export class GetUserBalanceController {
    constructor(getUserBalanceUseCase) {
        this.getUserBalanceUseCase = getUserBalanceUseCase
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            const from = httpRequest.query.from
            const to = httpRequest.query.to

            if (httpRequest.userId && userId !== httpRequest.userId) {
                return forbidden()
            }

            await getUserBalanceSchema.parseAsync({ userId, from, to })

            const balance = await this.getUserBalanceUseCase.execute(
                userId,
                from,
                to,
            )

            return ok(balance)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({ message: error.message })
            }

            if (error.name === 'UserNotFoundError') {
                return userNotFoundResponse()
            }

            if (process.env.NODE_ENV !== 'production') {
                console.error(error)
            }
            return serverError()
        }
    }
}
