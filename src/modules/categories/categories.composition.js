import {
    CreateCategoryController,
    ListCategoriesController,
} from '../../controllers/category/category.js'
import {
    CreateCategoryUseCase,
    ListCategoriesUseCase,
} from '../../use-cases/category/category.js'
import {
    PostgresCreateCategoryRepository,
    PostgresListCategoriesRepository,
} from './categories.repository.js'
import { PostgresGetUserByIdRepository } from '../../repositories/postgres/user/get-user-by-id.js'
import { IdGeneratorAdapter } from '../../adapters/index.js'

export const makeCreateCategoryController = () => {
    return new CreateCategoryController(
        new CreateCategoryUseCase(
            new PostgresCreateCategoryRepository(),
            new PostgresGetUserByIdRepository(),
            new IdGeneratorAdapter(),
        ),
    )
}

export const makeListCategoriesController = () => {
    return new ListCategoriesController(
        new ListCategoriesUseCase(
            new PostgresListCategoriesRepository(),
            new PostgresGetUserByIdRepository(),
        ),
    )
}
