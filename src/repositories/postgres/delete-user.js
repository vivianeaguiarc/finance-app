import { PostgresHelper } from '../../db/postgres/helper.js'

export class PostgresDeleteUserRepository {
    async delete(userId) {
        const deleteUser = await PostgresHelper.client.user.delete(
            'DELETE FROM users WHERE id = $1 RETURNING *',
            [userId],
        )
        return deleteUser[0]
    }
}
