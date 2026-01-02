// import express from 'express'
// import cors from 'cors'
// import { usersRouter, transactionsRouter } from './routes/index.js'
// import swaggerUi from 'swagger-ui-express'
// import fs from 'fs'
// import { fileURLToPath } from 'url'
// import { dirname, join } from 'path'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)

// export const app = express()

// app.use(
//     cors({
//         origin: 'http://localhost:5173',
//     }),
// )

// app.use(express.json())

// app.use('/api/users', usersRouter)
// app.use('/api/transactions', transactionsRouter)

// const swaggerDocument = JSON.parse(
//     fs.readFileSync(join(__dirname, '../docs/swagger.json'), 'utf-8'),
// )

// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
import express from 'express'
import cors from 'cors'
import { usersRouter, transactionsRouter } from './routes/index.js'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import { join } from 'path'

export const app = express()

app.use(cors())
app.use(express.json())

// 🔹 Health / Root
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'FinanceApp API is running 🚀',
        docs: '/docs',
    })
})

// 🔹 Rotas
app.use('/api/users', usersRouter)
app.use('/api/transactions', transactionsRouter)

// 🔹 Swagger
const swaggerPath = join(process.cwd(), 'docs', 'swagger.json')
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'))

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
