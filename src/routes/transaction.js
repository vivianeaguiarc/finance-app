import { Router } from 'express'

import {
    makeCreateTransactionController,
    makeGetTransactionsByUserIdController,
    makeUpdateTransactionController,
    makeDeleteTransactionController,
} from '../factories/controllers/transaction.js'
import { auth } from '../middlewares/auth.js'
import { sendHttpResponse } from './http-response.js'

export const transactionsRouter = Router()

transactionsRouter.post('/me', auth, async (request, response) => {
    const controller = makeCreateTransactionController()
    sendHttpResponse(
        response,
        await controller.execute({
            ...request,
            userId: request.userId,
            body: {
                ...request.body,
                user_id: request.userId,
            },
            params: { userId: request.userId },
        }),
    )
})

transactionsRouter.get('/me', auth, async (request, response) => {
    const controller = makeGetTransactionsByUserIdController()
    sendHttpResponse(
        response,
        await controller.execute({
            userId: request.userId,
            query: request.query ?? {},
        }),
    )
})

transactionsRouter.get('/', auth, async (request, response) => {
    const controller = makeGetTransactionsByUserIdController()
    sendHttpResponse(
        response,
        await controller.execute({
            userId: request.userId,
            query: request.query ?? {},
        }),
    )
})

transactionsRouter.post('/', auth, async (request, response) => {
    const controller = makeCreateTransactionController()
    sendHttpResponse(
        response,
        await controller.execute({
            ...request,
            body: {
                ...request.body,
                user_id: request.userId,
            },
        }),
    )
})

transactionsRouter.patch(
    '/me/:transactionId',
    auth,
    async (request, response) => {
        const controller = makeUpdateTransactionController()
        sendHttpResponse(
            response,
            await controller.execute({
                params: {
                    transactionId: request.params.transactionId,
                },
                body: {
                    ...request.body,
                    user_id: request.userId,
                },
            }),
        )
    },
)

transactionsRouter.delete(
    '/me/:transactionId',
    auth,
    async (request, response) => {
        const controller = makeDeleteTransactionController()
        sendHttpResponse(
            response,
            await controller.execute({
                ...request,
                userId: request.userId,
                params: {
                    transactionId: request.params.transactionId,
                    user_id: request.userId,
                },
            }),
        )
    },
)
