import 'dotenv/config'
import express from 'express'
import { CreateUserController } from './src/controllers/create-user.js'

const app = express()
app.use(express.json())

app.post('/api/users', async (request, response) => {
    const createUserController = new CreateUserController()
    const { statusCode, body } = await createUserController.execute(request)
    response.status(statusCode).send(body)
})

app.listen(3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`)
})
