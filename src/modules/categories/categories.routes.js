import { Router } from 'express'
import {
    makeCreateCategoryController,
    makeListCategoriesController,
} from './categories.composition.js'
import { auth } from '../../shared/middlewares/index.js'
import { sendHttpResponse } from '../../shared/http/send-http-response.js'

export const categoriesRouter = Router()

categoriesRouter.post('/', auth, async (req, res) => {
    const controller = makeCreateCategoryController()
    sendHttpResponse(
        res,
        await controller.execute({
            userId: req.userId,
            body: req.body,
        }),
    )
})

categoriesRouter.get('/', auth, async (req, res) => {
    const controller = makeListCategoriesController()
    sendHttpResponse(
        res,
        await controller.execute({
            userId: req.userId,
        }),
    )
})
