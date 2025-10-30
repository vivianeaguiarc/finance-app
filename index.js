import 'dotenv/config'
import express from 'express'
import {
    makeDeleteUserController,
    makeGetUserByIdController,
    makeCreateUserController,
    makeUpdateUserController,
} from './src/factories/controllers/user.js'

const app = express()
app.use(express.json())

app.get('/api/users/:userId', async (request, response) => {
    const gettUserByIdController = makeGetUserByIdController()
    const { statusCode, body } = await gettUserByIdController.execute(request)
    response.status(statusCode).send(body)
})

app.post('/api/users', async (request, response) => {
    const createUserController = makeCreateUserController()
    const { statusCode, body } = await createUserController.execute(request)
    response.status(statusCode).send(body)
})
app.patch('/api/users/:userId', async (request, response) => {
    const updateUserController = makeUpdateUserController()
    const { statusCode, body } = await updateUserController.execute(request)
    response.status(statusCode).send(body)
})

app.delete('/api/users/:userId', async (request, response) => {
    const deleteUserController = makeDeleteUserController()
    const { statusCode, body } = await deleteUserController.exceute(request)
    response.status(statusCode).send(body)
})
app.listen(3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`)
})
