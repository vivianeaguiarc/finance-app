import express from 'express'
import cors from 'cors'
import { usersRouter, transactionsRouter } from './routes/index.js'
import { healthHandler } from './modules/health/health.controller.js'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import { join } from 'path'
import { getCorsOptions, getHelmetMiddleware } from './config/index.js'
import {
    globalLimiter,
    requestIdMiddleware,
    requestLogger,
    errorHandler,
} from './shared/middlewares/index.js'

export const app = express()

app.use(requestIdMiddleware)
app.use(requestLogger)
app.use(getHelmetMiddleware())
app.use(cors(getCorsOptions()))
app.use(express.json())
app.use(globalLimiter)

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'FinanceApp API is running',
        data: {
            docs: '/docs',
            health: '/health',
        },
        requestId: req.id,
    })
})

app.get('/health', healthHandler)

app.use('/api/users', usersRouter)
app.use('/api/transactions', transactionsRouter)

const swaggerPath = join(process.cwd(), 'docs', 'swagger.json')
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'))

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(errorHandler)
