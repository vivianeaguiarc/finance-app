// import {
//     ok,
//     badRequest,
//     serverError,
//     userNotFoundResponse,
// } from '../helpers/index.js'
// import { ZodError } from 'zod'
// import { getUserBalanceSchema } from '../../schemas/index.js' // ← IMPORT OBRIGATÓRIO

// export class GetUserBalanceController {
//     constructor(getUserBalanceUseCase) {
//         this.getUserBalanceUseCase = getUserBalanceUseCase
//     }

//     async execute(httpRequest) {
//         try {
//             const userId = httpRequest.userId
//             const from = httpRequest.query.from
//             const to = httpRequest.query.to

//             // TESTE EXIGE userId (não userid)
//             await getUserBalanceSchema.parseAsync({ userId, from, to })

//             // TESTE EXIGE 1 PARÂMETRO APENAS
//             const balance = await this.getUserBalanceUseCase.execute(userId, from, to)

//             return ok(balance)
//         } catch (error) {
//            if (error instanceof ZodError) {
//                return badRequest({
//                    message: error.message,
//                })
//            }

//             if (error.name === 'UserNotFoundError') {
//                 return userNotFoundResponse()
//             }

//             console.error(error)
//             return serverError()
//         }
//     }
// }
import {
    ok,
    badRequest,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js'
import { ZodError } from 'zod'
import { getUserBalanceSchema } from '../../schemas/index.js'

export class GetUserBalanceController {
    constructor(getUserBalanceUseCase) {
        this.getUserBalanceUseCase = getUserBalanceUseCase
    }

    async execute(httpRequest) {
        try {
            // TESTES EXIGEM params.userId
            const userId = httpRequest.params.userId
            const from = httpRequest.query.from
            const to = httpRequest.query.to

            // TESTE EXIGE userId (com "d")
            await getUserBalanceSchema.parseAsync({ userId, from, to })

            // TESTE EXIGE 3 PARÂMETROS NO USE-CASE
            const balance = await this.getUserBalanceUseCase.execute(
                userId,
                from,
                to,
            )

            return ok(balance)
        } catch (error) {
            // TESTE EXIGE 400 se Zod falhar
            if (error instanceof ZodError) {
                return badRequest({ message: error.message })
            }

            // TESTE EXIGE 404 se UserNotFoundError
            if (error.name === 'UserNotFoundError') {
                return userNotFoundResponse()
            }

            // Qualquer outro erro → 500
            console.error(error)
            return serverError()
        }
    }
}
