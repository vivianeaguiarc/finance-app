import { getUserBalanceSchema } from '../../schemas/index.js'
import { ok, forbidden, mapErrorToHttpResponse } from '../helpers/index.js'
import { UserNotFoundError } from '../../errors/user.js'
import { userNotFoundResponse } from '../helpers/user.js'

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

            return ok(balance, 'Balance retrieved successfully')
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            return mapErrorToHttpResponse(error)
        }
    }
}
