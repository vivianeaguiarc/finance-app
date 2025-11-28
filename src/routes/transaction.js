import { Router } from 'express'

import {
    makeCreateTransactionController,
    makeGetTransactionsByUserIdController,
    makeUpdateTransactionController,
    makeDeleteTransactionController,
} from '../factories/controllers/transaction.js'
import { auth } from '../middlewares/auth.js'

export const transactionsRouter = Router()

transactionsRouter.post('/me', auth, async (request, response) => {
    const controller = makeCreateTransactionController()

    const { statusCode, body } = await controller.execute({
        ...request,
        body: {
            ...request.body,
            user_id: request.userId,
        },
        params: { userId: request.userId },
    })

    response.status(statusCode).send(body)
})

transactionsRouter.get('/me', auth, async (request, response) => {
    const controller = makeGetTransactionsByUserIdController()

    const { statusCode, body } = await controller.execute({
        ...request,
        params: { userId: request.userId },
        query: request.query,
    })

    response.status(statusCode).send(body)
})
transactionsRouter.get('/', auth, async (request, response) => {
    const controller = makeGetTransactionsByUserIdController()

    const { statusCode, body } = await controller.execute({
        ...request,
        query: {
            ...request.query,
            user_id: request.userId,
        },
    })

    response.status(statusCode).send(body)
})

transactionsRouter.post('/', auth, async (request, response) => {
    const controller = makeCreateTransactionController()

    const { statusCode, body } = await controller.execute({
        ...request,
        body: {
            ...request.body,
            user_id: request.userId, // força user logado
        },
    })

    response.status(statusCode).send(body)
})

transactionsRouter.patch(
    '/me/:transactionId',
    auth,
    async (request, response) => {
        const controller = makeUpdateTransactionController()

        const { statusCode, body } = await controller.execute({
            ...request,
            body: {
                ...request.params,
                user_id: request.userId,
            },
        })

        response.status(statusCode).send(body)
    },
)

transactionsRouter.delete(
    '/me/:transactionId',
    auth,
    async (request, response) => {
        const controller = makeDeleteTransactionController()

        const { statusCode, body } = await controller.execute({
            ...request,
            params: {
                transactionId: request.params.transactionId,
                user_id: request.userId,
            },
        })

        response.status(statusCode).send(body)
    },
)
