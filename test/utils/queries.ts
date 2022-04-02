import { pool } from '../../src/config/database'
import { FilledUser } from '../factories/user.factory'

export async function cleanTable(tableName: string) {
    return pool.query(`DELETE FROM ${tableName}`)
}

export async function saveUsersToDB(users: FilledUser[]) {
    let paramCounter = 1
    const values: string[] = users
        .map((u) => [u.firstName, u.lastName, u.email])
        .flat()

    const valuesStrings = []
    for (let i = 0; i < users.length; i++) {
        valuesStrings.push(
            `($${paramCounter}, $${paramCounter + 1}, $${paramCounter + 2})`
        )

        paramCounter += 3
    }

    const query = `
        INSERT INTO users (first_name, last_name, email)
        VALUES ${valuesStrings.join(', ')}
        RETURNING *
    `

    return pool.query(query, values)
}
