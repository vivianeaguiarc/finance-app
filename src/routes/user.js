import { Router } from 'express'
import {
    makeDeleteUserController,
    makeGetUserByIdController,
    makeCreateUserController,
    makeUpdateUserController,
    makeGetUserBalanceController,
    makeLoginUserController,
    makeRefreshTokenController,
    makeLogoutUserController,
    makeLogoutAllSessionsController,
} from '../factories/controllers/user.js'
import { auth } from '../middlewares/auth.js'
import { authLimiter } from '../middlewares/rate-limit.js'
import { sendHttpResponse } from './http-response.js'

export const usersRouter = Router()

usersRouter.post('/', authLimiter, async (req, res) => {
    const controller = makeCreateUserController()
    sendHttpResponse(res, await controller.execute(req))
})

usersRouter.post('/login', authLimiter, async (req, res) => {
    const controller = makeLoginUserController()
    sendHttpResponse(res, await controller.execute(req))
})

usersRouter.post('/refresh-token', authLimiter, async (req, res) => {
    const controller = makeRefreshTokenController()
    sendHttpResponse(res, await controller.execute(req))
})

usersRouter.post('/logout', authLimiter, async (req, res) => {
    const controller = makeLogoutUserController()
    sendHttpResponse(res, await controller.execute(req))
})

usersRouter.post('/logout-all', auth, authLimiter, async (req, res) => {
    const controller = makeLogoutAllSessionsController()
    sendHttpResponse(
        res,
        await controller.execute({
            ...req,
            userId: req.userId,
        }),
    )
})

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
