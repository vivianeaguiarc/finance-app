// index.js (raiz do app)
import 'dotenv/config'
import express from 'express'

import {
    CreateUserController,
    GetUserByIdController,
    UpdateUserController,
    DeleteUserController,
} from './src/controllers/index.js'
import {
    CreateUserUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
} from './src/use-cases/index.js'
import {
    PostgresCreateUserRepository,
    PostgresGetUserByIdRepository,
    PostgresGetUserByEmailRepository,
    PostgresUpdateUserRepository,
} from './src/repositories/postgres/index.js'

const app = express()
app.use(express.json())

app.get('/api/users/:userId', async (request, response) => {
    const repo = new PostgresGetUserByIdRepository()
    const useCase = new GetUserByIdUseCase(repo)
    const controller = new GetUserByIdController(useCase)

    const { statusCode, body } = await controller.execute(request)
    response.status(statusCode).send(body)
})

app.post('/api/users', async (request, response) => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
    const createUserRepository = new PostgresCreateUserRepository()
    const createUserUseCase = new CreateUserUseCase(
        getUserByEmailRepository,
        createUserRepository,
    )
    const createUsercontroller = new CreateUserController(createUserUseCase)
    const { statusCode, body } = await createUsercontroller.execute(request)
    response.status(statusCode).send(body)
})

app.patch('/api/users/:userId', async (request, response) => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
    const updateUserRepository = new PostgresUpdateUserRepository()
    const updateUserUseCase = new UpdateUserUseCase(
        getUserByEmailRepository,
        updateUserRepository,
    )
    const controller = new UpdateUserController(updateUserUseCase)
    const { statusCode, body } = await controller.execute(request)
    response.status(statusCode).send(body)
})

app.delete('/api/users/:userId', async (request, response) => {
    const controller = new DeleteUserController()
    const { statusCode, body } = await controller.execute(request)
    response.status(statusCode).send(body)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
