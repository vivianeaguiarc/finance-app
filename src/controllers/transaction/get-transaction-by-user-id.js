// import {
//     serverError,
//     ok,
//     userNotFoundResponse,
//     badRequest,
// } from '../helpers/index.js'
// import { UserNotFoundError } from '../../errors/index.js'
// import { ZodError } from 'zod'
// import { getTransactionsByUserIdSchema } from '../../schemas/transaction.js'

// export class GetTransactionByUserIdController {
//     constructor(getTransactionByUserIdUseCase) {
//         this.getTransactionByUserIdUseCase = getTransactionByUserIdUseCase
//     }
//     async execute(httpRequest) {
//         try {
//             const userId = httpRequest.query.userId
//             const from = httpRequest.query.from
//             const to = httpRequest.query.to

//             await getTransactionsByUserIdSchema.parse({ userId, from, to })
//             const transactions =
//                 await this.getTransactionByUserIdUseCase.execute(
//                     userId,
//                     from,
//                     to,
//                 )
//             return ok(transactions)
//         } catch (error) {
//             console.error(error)
//             if (error instanceof UserNotFoundError) {
//                 return userNotFoundResponse()
//             }
//             if (error instanceof ZodError) {
//                 return badRequest({
//                     message: error.issues[0].message,
//                 })
//             }
//             return serverError()
//         }
//     }
// }
import {
    serverError,
    ok,
    userNotFoundResponse,
    badRequest,
} from '../helpers/index.js'
import { UserNotFoundError } from '../../errors/index.js'
import { ZodError } from 'zod'
import { getTransactionsByUserIdSchema } from '../../schemas/transaction.js'

export class GetTransactionByUserIdController {
    constructor(getTransactionByUserIdUseCase) {
        this.getTransactionByUserIdUseCase = getTransactionByUserIdUseCase
    }

    async execute(httpRequest) {
        try {
            // ✅ userId vem do auth middleware
            const userId = httpRequest.userId

            // filtros opcionais vêm da query
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

            return ok(transactions)
        } catch (error) {
            console.error(error)

            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }

            return serverError()
        }
    }
}
