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

export const usersRouter = Router()

// ------------------------
// ROTAS PÚBLICAS (SEM AUTH)
// ------------------------

usersRouter.post('/', async (req, res) => {
    const controller = makeCreateUserController()
    const { statusCode, body } = await controller.execute(req)
    res.status(statusCode).send(body)
})

usersRouter.post('/login', async (req, res) => {
    const controller = makeLoginUserController()
    const { statusCode, body } = await controller.execute(req)
    res.status(statusCode).send(body)
})

usersRouter.post('/refresh-token', async (req, res) => {
    const controller = makeRefreshTokenController()
    const { statusCode, body } = await controller.execute(req)
    res.status(statusCode).send(body)
})

// ------------------------
// ROTAS PROTEGIDAS (COM AUTH)
// ------------------------

usersRouter.get('/', auth, async (req, res) => {
    const controller = makeGetUserByIdController()
    const { statusCode, body } = await controller.execute({
        ...req,
        params: { userId: req.userId },
    })
    res.status(statusCode).send(body)
})

usersRouter.get('/balance', auth, async (req, res) => {
    const controller = makeGetUserBalanceController()
    const { statusCode, body } = await controller.execute({
        ...req,
        params: { userId: req.userId },
    })
    res.status(statusCode).send(body)
})

usersRouter.patch('/', auth, async (req, res) => {
    const controller = makeUpdateUserController()
    const { statusCode, body } = await controller.execute({
        ...req,
        params: { userId: req.userId },
    })
    res.status(statusCode).send(body)
})

usersRouter.delete('/', auth, async (req, res) => {
    const controller = makeDeleteUserController()
    const { statusCode, body } = await controller.execute({
        ...req,
        params: { userId: req.userId },
    })
    res.status(statusCode).send(body)
})

// ------------------------
// ROTA DINÂMICA — SEMPRE POR ÚLTIMO
// ------------------------

usersRouter.get('/:userId', auth, async (req, res) => {
    const controller = makeGetUserByIdController()
    const { statusCode, body } = await controller.execute(req)
    res.status(statusCode).send(body)
})
