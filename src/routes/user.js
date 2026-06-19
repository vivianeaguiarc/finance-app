import { Router } from 'express'
import {
    makeDeleteUserController,
    makeGetUserByIdController,
    makeCreateUserController,
    makeUpdateUserController,
    makeGetUserBalanceController,
    makeLoginUserController,
    makeRefreshTokenController,
} from '../factories/controllers/user.js'
import { auth } from '../middlewares/auth.js'
import { authLimiter } from '../middlewares/rate-limit.js'

export const usersRouter = Router()

// ------------------------
// ROTAS PÚBLICAS (SEM AUTH)
// ------------------------

usersRouter.post('/', authLimiter, async (req, res) => {
    const controller = makeCreateUserController()
    const { statusCode, body } = await controller.execute(req)
    res.status(statusCode).send(body)
})

usersRouter.post('/login', authLimiter, async (req, res) => {
    const controller = makeLoginUserController()
    const { statusCode, body } = await controller.execute(req)
    res.status(statusCode).send(body)
})

usersRouter.post('/refresh-token', authLimiter, async (req, res) => {
    const controller = makeRefreshTokenController()
    const { statusCode, body } = await controller.execute(req)
    res.status(statusCode).send(body)
})

// ------------------------
// ROTAS PROTEGIDAS (COM AUTH)
// ------------------------

usersRouter.get('/me', auth, async (req, res) => {
    const controller = makeGetUserByIdController()
    const { statusCode, body } = await controller.execute({
        ...req,
        userId: req.userId,
        params: { userId: req.userId },
        query: { from: req.query.from, to: req.query.to },
    })
    res.status(statusCode).send(body)
})

usersRouter.get('/me/balance', auth, async (req, res) => {
    const controller = makeGetUserBalanceController()
    const { statusCode, body } = await controller.execute({
        ...req,
        userId: req.userId,
        params: { userId: req.userId },
        query: req.query,
    })
    res.status(statusCode).send(body)
})

usersRouter.patch('/me', auth, async (req, res) => {
    const controller = makeUpdateUserController()
    const { statusCode, body } = await controller.execute({
        ...req,
        userId: req.userId,
        params: { userId: req.userId },
    })
    res.status(statusCode).send(body)
})

usersRouter.delete('/me', auth, async (req, res) => {
    const controller = makeDeleteUserController()
    const { statusCode, body } = await controller.execute({
        ...req,
        userId: req.userId,
        params: { userId: req.userId },
    })
    res.status(statusCode).send(body)
})
