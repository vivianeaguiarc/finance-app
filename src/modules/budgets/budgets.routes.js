import { Router } from 'express'
import {
    makeCreateMonthlyBudgetController,
    makeListMonthlyBudgetsController,
    makeGetBudgetStatusController,
} from './budgets.composition.js'
import { auth } from '../../shared/middlewares/index.js'
import { sendHttpResponse } from '../../shared/http/send-http-response.js'

export const budgetsRouter = Router()

budgetsRouter.post('/', auth, async (req, res) => {
    const controller = makeCreateMonthlyBudgetController()
    sendHttpResponse(
        res,
        await controller.execute({
            userId: req.userId,
            body: req.body,
        }),
    )
})

budgetsRouter.get('/status', auth, async (req, res) => {
    const controller = makeGetBudgetStatusController()
    sendHttpResponse(
        res,
        await controller.execute({
            userId: req.userId,
            query: req.query ?? {},
        }),
    )
})

budgetsRouter.get('/', auth, async (req, res) => {
    const controller = makeListMonthlyBudgetsController()
    sendHttpResponse(
        res,
        await controller.execute({
            userId: req.userId,
            query: req.query ?? {},
        }),
    )
})
