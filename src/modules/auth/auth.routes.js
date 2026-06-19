import { Router } from 'express'
import {
    makeCreateUserController,
    makeLoginUserController,
    makeRefreshTokenController,
    makeLogoutUserController,
    makeLogoutAllSessionsController,
} from './auth.composition.js'
import { auth } from '../../shared/middlewares/index.js'
import { authLimiter } from '../../shared/middlewares/index.js'
import { sendHttpResponse } from '../../shared/http/send-http-response.js'

export const authRouter = Router()

authRouter.post('/', authLimiter, async (req, res) => {
    const controller = makeCreateUserController()
    sendHttpResponse(res, await controller.execute(req))
})

authRouter.post('/login', authLimiter, async (req, res) => {
    const controller = makeLoginUserController()
    sendHttpResponse(res, await controller.execute(req))
})

authRouter.post('/refresh-token', authLimiter, async (req, res) => {
    const controller = makeRefreshTokenController()
    sendHttpResponse(res, await controller.execute(req))
})

authRouter.post('/logout', authLimiter, async (req, res) => {
    const controller = makeLogoutUserController()
    sendHttpResponse(res, await controller.execute(req))
})

authRouter.post('/logout-all', auth, authLimiter, async (req, res) => {
    const controller = makeLogoutAllSessionsController()
    sendHttpResponse(
        res,
        await controller.execute({
            ...req,
            userId: req.userId,
        }),
    )
})
