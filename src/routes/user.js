import { Router } from 'express'
import { authRouter } from '../modules/auth/auth.routes.js'
import { usersRouter as usersProfileRouter } from '../modules/users/users.routes.js'

export const usersRouter = Router()

usersRouter.use(authRouter)
usersRouter.use(usersProfileRouter)
