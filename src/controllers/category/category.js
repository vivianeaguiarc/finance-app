import { createCategorySchema } from '../../schemas/category.js'
import {
    created,
    ok,
    mapErrorToHttpResponse,
    userNotFoundResponse,
} from '../helpers/index.js'
import {
    CategoryAlreadyExistsError,
    UserNotFoundError,
} from '../../errors/index.js'

export class CreateCategoryController {
    constructor(createCategoryUseCase) {
        this.createCategoryUseCase = createCategoryUseCase
    }

    async execute(httpRequest) {
        try {
            const { name } = await createCategorySchema.parseAsync(
                httpRequest.body,
            )

            const category = await this.createCategoryUseCase.execute(
                httpRequest.userId,
                name,
            )

            return created(category, 'Category created successfully')
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            if (error instanceof CategoryAlreadyExistsError) {
                return mapErrorToHttpResponse(error, httpRequest)
            }

            return mapErrorToHttpResponse(error, httpRequest)
        }
    }
}

export class ListCategoriesController {
    constructor(listCategoriesUseCase) {
        this.listCategoriesUseCase = listCategoriesUseCase
    }

    async execute(httpRequest) {
        try {
            const categories = await this.listCategoriesUseCase.execute(
                httpRequest.userId,
            )

            return ok(categories, 'Categories retrieved successfully')
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            return mapErrorToHttpResponse(error, httpRequest)
        }
    }
}
