import { pool } from '../config/database'
import createError from 'http-errors'
import log4js from 'log4js'

const logger = log4js.getLogger('userDaos.ts')
logger.level = 'debug'

/**
 * Makes the query to the database to get all the users
 * @returns Promise<QueryResult<any>>
 */
export async function getAllUsersDao() {
    try {
        logger.info('Getting users')
        return pool.query('SELECT * FROM "users"')
    } catch (error) {
        logger.error('Database error: ', error)
        throw new createError.InternalServerError('Database Error')
    }
}

/**
 * Makes the query to the database the user with the given id
 * @param id - User's id to find
 * @returns Promise<QueryResult<any>>
 */
export async function getUserByIdDao(id: string) {
    try {
        logger.info('Getting user by id')
        return pool.query('SELECT * FROM "users" WHERE id = $1', [id])
    } catch (error) {
        logger.error('Database error: ', error)
        throw new createError.InternalServerError('Database Error')
    }
}

export async function getUserByEmailDao(email: string, avoidId?: string) {
    try {
        logger.info('Getting user by email')

        const params = [email]
        let query = 'SELECT * FROM "users" WHERE email = $1'

        if (avoidId) {
            params.push(avoidId)
            query += ' AND id != $2'
        }

        return pool.query(query, params)
    } catch (error) {
        logger.error('Database error: ', error)
        throw new createError.InternalServerError('Database Error')
    }
}

/**
 * Makes the query to the database to create a user
 * @param firstName - first name to assign to the user
 * @param lastName - last name to assign to the user
 * @param email - email to assign to the user
 * @returns Promise<QueryResult<any>>
 */
export async function createUserDao(
    firstName: string,
    lastName: string,
    email: string
) {
    try {
        logger.info('Creating user')
        return pool.query(
            `INSERT INTO "users" ("first_name", "last_name", "email")
                VALUES ($1, $2, $3) RETURNING "id"`,
            [firstName, lastName, email]
        )
    } catch (error) {
        logger.error('Database error: ', error)
        throw new createError.InternalServerError('Database Error')
    }
}

/**
 * Makes the query to update the user with the given id
 * @param id - id of the user to edit
 * @param firstName - first name to assign to the user
 * @param lastName - last name to assign to the user
 * @param email - email to assign to the user
 * @returns Promise<QueryResult<any>>
 */
export async function updateUserDao(
    id: string,
    firstName: string,
    lastName: string,
    email: string
) {
    console.log(id, firstName, lastName, email)
    try {
        // logger.info('Updating user')
        return pool.query(
            `UPDATE "users"
                SET "first_name" = $1,
                    "last_name" = $2,
                    "email" = $3,
                    "updated_at" = now()
                WHERE "id" = $4`,
            [firstName, lastName, email, id]
        )
    } catch (error) {
        logger.error('Database error: ', error)
        throw new createError.InternalServerError('Database Error')
    }
}

/**
 * Makes the query to delete the user with the given id
 * @param id - id of the user to delete
 * @returns Promise<QueryResult<any>>
 */
export async function deleteUserDao(id: string) {
    try {
        logger.info('Deleting user')
        return pool.query('DELETE FROM "users" WHERE "id" = $1', [id])
    } catch (error) {
        logger.error('Database error: ', error)
        throw new createError.InternalServerError('Database Error')
    }
}
