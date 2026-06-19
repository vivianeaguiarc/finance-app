import { Router } from 'express'
import { makeGetDashboardController } from './dashboard.composition.js'
import { auth } from '../../shared/middlewares/index.js'
import { sendHttpResponse } from '../../shared/http/send-http-response.js'

export const dashboardRouter = Router()

dashboardRouter.get('/', auth, async (req, res) => {
    const controller = makeGetDashboardController()
    sendHttpResponse(
        res,
        await controller.execute({
            userId: req.userId,
            query: req.query ?? {},
        }),
    )
})
