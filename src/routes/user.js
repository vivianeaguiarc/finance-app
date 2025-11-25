import { Router } from 'express'
import {
    makeDeleteUserController,
    makeGetUserByIdController,
    makeCreateUserController,
    makeUpdateUserController,
    makeGetUserBalanceController,
    makeLoginUserController,
} from '../factories/controllers/user.js'
import { makeGetTransactionBalanceController } from '../factories/controllers/transaction.js'
import { auth } from '../middlewares/auth.js'

export const usersRouter = Router()

// ------------------------
// ROTAS PÚBLICAS (SEM AUTH)
// ------------------------

usersRouter.post('/', async (request, response) => {
    const createUserController = makeCreateUserController()
    const { statusCode, body } = await createUserController.execute(request)
    response.status(statusCode).send(body)
})

usersRouter.post('/login', async (request, response) => {
    const loginUserController = makeLoginUserController()
    const { statusCode, body } = await loginUserController.execute(request)
    response.status(statusCode).send(body)
})

// ------------------------
// ROTAS PROTEGIDAS (COM AUTH)
// ------------------------

usersRouter.get('/', auth, async (request, response) => {
    const gettUserByIdController = makeGetUserByIdController()
    const { statusCode, body } = await gettUserByIdController.execute({
        ...request,
        params: { userId: request.userId },
    })
    response.status(statusCode).send(body)
})

usersRouter.get('/balance', auth, async (request, response) => {
    const getUserBalanceController = makeGetUserBalanceController()
    const { statusCode, body } = await getUserBalanceController.execute({
        ...request,
        params: { userId: request.userId },
    })
    response.status(statusCode).send(body)
})

usersRouter.patch('/', auth, async (request, response) => {
    const updateUserController = makeUpdateUserController()
    const { statusCode, body } = await updateUserController.execute({
        ...request,
        params: { userId: request.userId },
    })
    response.status(statusCode).send(body)
})

usersRouter.delete('/', auth, async (request, response) => {
    const deleteUserController = makeDeleteUserController()
    const { statusCode, body } = await deleteUserController.execute({
        ...request,
        params: { userId: request.userId },
    })
    response.status(statusCode).send(body)
})

// ------------------------
// ROTA GENÉRICA POR ÚLTIMO
// ------------------------

usersRouter.get('/:userId', auth, async (request, response) => {
    const gettUserByIdController = makeGetUserByIdController()
    const { statusCode, body } = await gettUserByIdController.execute(request)
    response.status(statusCode).send(body)
})
