import { PostgresGetUserByIdRepository } from '../repositories/postgres/get-user-by-id.js'

export class GetUserByIdUseCase {
    async exceute(userId) {
        const getUserByIdRepository = new PostgresGetUserByIdRepository()
        const user = await getUserByIdRepository.execute(userId)
        return user
    }
}
