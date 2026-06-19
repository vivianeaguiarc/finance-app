import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { usersRouter, transactionsRouter } from './routes/index.js'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import { join } from 'path'
import { getCorsOptions } from './config/cors.js'
import { globalLimiter } from './middlewares/rate-limit.js'

export const app = express()

app.use(helmet())
app.use(cors(getCorsOptions()))
app.use(express.json())
app.use(globalLimiter)

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'FinanceApp API is running 🚀',
        docs: '/docs',
    })
})

app.use('/api/users', usersRouter)
app.use('/api/transactions', transactionsRouter)

const swaggerPath = join(process.cwd(), 'docs', 'swagger.json')
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'))

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use((error, req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        console.error(error)
    }

    if (error.message === 'Not allowed by CORS') {
        return res.status(403).json({ message: 'Forbidden' })
    }

    return res.status(500).json({ message: 'Internal server error' })
})
