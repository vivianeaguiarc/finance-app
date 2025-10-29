import 'dotenv/config'
import express from 'express'
import {
    CreateUserController,
    UpdateUserController,
    GetUserByIdController,
} from './src/controllers/index.js'

const app = express()
app.use(express.json())

app.post('/api/users', async (request, response) => {
    const createUserController = new CreateUserController()
    const { statusCode, body } = await createUserController.execute(request)
    response.status(statusCode).send(body)
})
app.patch('/api/users/:userId', async (request, response) => {
    const updateUserController = new UpdateUserController()
    const { statusCode, body } = await updateUserController.execute(request)
    response.status(statusCode).send(body)
})

app.get('/api/users/:userId', async (request, response) => {
    const gettUserByIdController = new GetUserByIdController()
    const { statusCode, body } = await gettUserByIdController.execute(request)
    response.status(statusCode).send(body)
})
app.listen(3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`)
})
