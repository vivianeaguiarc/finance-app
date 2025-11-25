// import { Router } from 'express'
// import {
//     makeDeleteUserController,
//     makeGetUserByIdController,
//     makeCreateUserController,
//     makeUpdateUserController,
//     makeGetUserBalanceController,
//     makeLoginUserController,
// } from '../factories/controllers/user.js'
// import { makeGetTransactionBalanceController } from '../factories/controllers/transaction.js'
// import { auth } from '../middlewares/auth.js'

// export const usersRouter = Router()

// usersRouter.get('/:userId', auth, async (request, response) => {
//     const gettUserByIdController = makeGetUserByIdController()
//     const { statusCode, body } = await gettUserByIdController.execute(request)
//     response.status(statusCode).send(body)
// })
// usersRouter.get('/:userId/balance', auth, async (request, response) => {
//     const getUserBalanceController = makeGetUserBalanceController()
//     const { statusCode, body } = await getUserBalanceController.execute(request)
//     response.status(statusCode).send(body)
// })
// usersRouter.get('/api/users/:userId/balance', auth, async (req, res) => {
//     const controller = makeGetTransactionBalanceController()
//     const { statusCode, body } = await controller.execute(req)
//     res.status(statusCode).send(body)
// })

// usersRouter.post('/', async (request, response) => {
//     const createUserController = makeCreateUserController()
//     const { statusCode, body } = await createUserController.execute(request)
//     response.status(statusCode).send(body)
// })
// usersRouter.patch('/:userId', auth, async (request, response) => {
//     const updateUserController = makeUpdateUserController()
//     const { statusCode, body } = await updateUserController.execute(request)
//     response.status(statusCode).send(body)
// })

// usersRouter.delete('/:userId', auth, async (request, response) => {
//     const deleteUserController = makeDeleteUserController()
//     const { statusCode, body } = await deleteUserController.execute(request)
//     response.status(statusCode).send(body)
// })
// usersRouter.post('/login', async (request, response) => {
//     const loginUserController = makeLoginUserController()
//     const { statusCode, body } = await loginUserController.execute(request)
//     response.status(statusCode).send(body)
// })
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

usersRouter.get('/:userId/balance', auth, async (request, response) => {
    const getUserBalanceController = makeGetUserBalanceController()
    const { statusCode, body } = await getUserBalanceController.execute(request)
    response.status(statusCode).send(body)
})

usersRouter.get('/api/users/:userId/balance', auth, async (req, res) => {
    const controller = makeGetTransactionBalanceController()
    const { statusCode, body } = await controller.execute(req)
    res.status(statusCode).send(body)
})

usersRouter.patch('/:userId', auth, async (request, response) => {
    const updateUserController = makeUpdateUserController()
    const { statusCode, body } = await updateUserController.execute(request)
    response.status(statusCode).send(body)
})

usersRouter.delete('/:userId', auth, async (request, response) => {
    const deleteUserController = makeDeleteUserController()
    const { statusCode, body } = await deleteUserController.execute(request)
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
