import { Router } from 'express'
import { makeGenerateFinancialReportController } from './reports.composition.js'
import { auth } from '../../shared/middlewares/index.js'
import { sendHttpResponse } from '../../shared/http/send-http-response.js'

export const reportsRouter = Router()

reportsRouter.get('/financial', auth, async (req, res) => {
    const controller = makeGenerateFinancialReportController()
    sendHttpResponse(
        res,
        await controller.execute({
            userId: req.userId,
            query: req.query ?? {},
        }),
    )
})
