import { Router } from 'express'
import {
    makeGetUserByIdController,
    makeUpdateUserController,
    makeDeleteUserController,
    makeGetUserBalanceController,
} from './users.composition.js'
import { auth } from '../../shared/middlewares/index.js'
import { sendHttpResponse } from '../../shared/http/send-http-response.js'

export const usersRouter = Router()

usersRouter.get('/me', auth, async (req, res) => {
    const controller = makeGetUserByIdController()
    sendHttpResponse(
        res,
        await controller.execute({
            ...req,
            userId: req.userId,
            params: { userId: req.userId },
            query: { from: req.query.from, to: req.query.to },
        }),
    )
})

usersRouter.get('/me/balance', auth, async (req, res) => {
    const controller = makeGetUserBalanceController()
    sendHttpResponse(
        res,
        await controller.execute({
            ...req,
            userId: req.userId,
            params: { userId: req.userId },
            query: req.query,
        }),
    )
})

usersRouter.patch('/me', auth, async (req, res) => {
    const controller = makeUpdateUserController()
    sendHttpResponse(
        res,
        await controller.execute({
            ...req,
            userId: req.userId,
            params: { userId: req.userId },
        }),
    )
})

usersRouter.delete('/me', auth, async (req, res) => {
    const controller = makeDeleteUserController()
    sendHttpResponse(
        res,
        await controller.execute({
            ...req,
            userId: req.userId,
            params: { userId: req.userId },
        }),
    )
})
