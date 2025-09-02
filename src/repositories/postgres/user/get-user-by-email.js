// src/repositories/postgres/get-user-by-email.js
import { PostgresHelper } from '../../../db/postgres/helper.js'

export class PostgresGetUserByEmailRepository {
    async execute(email) {
        const rows = await PostgresHelper.query(
            'SELECT * FROM users WHERE email = $1',
            [email],
        )
        return rows[0]
    }
}
