import {
    created,
    sanitizeUserWithTokens,
    mapErrorToHttpResponse,
} from '../helpers/index.js'
import { createdUserSchema } from '../../schemas/index.js'

export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            await createdUserSchema.parseAsync(params)
            const createdUser = await this.createUserUseCase.execute(params)
            return created(
                sanitizeUserWithTokens(createdUser),
                'User created successfully',
            )
        } catch (error) {
            return mapErrorToHttpResponse(error)
        }
    }
}
