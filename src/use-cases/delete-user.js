import { PostgresDeleteUserRepository } from '../repositories/postgres/index.js'

export class DeleteUserUseCase {
    async execute(userId) {
        const deleteUserRespository = new PostgresDeleteUserRepository()
        const deletedUser = deleteUserRespository.delete(userId)
        return deletedUser
    }
}
