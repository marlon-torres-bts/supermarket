import { Request, Response } from 'express'
import { QueryResult } from 'pg'
import { buildResponse } from '../utils/response'
import log4js from 'log4js'
import createError from 'http-errors'
import {
    createUserDao,
    deleteUserDao,
    getAllUsersDao,
    getUserByEmailDao,
    getUserByIdDao,
    updateUserDao,
} from '../daos/user'

const logger = log4js.getLogger('controllers/user.ts')
logger.level = 'debug'

/**
 * Controller for get all the users
 * @param _req - Received request
 * @param res - Response to send
 * @returns Promise<Response>
 */
export async function getAllUsersController(
    _req: Request,
    res: Response
): Promise<Response> {
    try {
        const dbResponse: QueryResult = await getAllUsersDao()
        return res
            .status(200)
            .json(
                buildResponse(
                    'success',
                    'Users retrieved successfully',
                    dbResponse.rows
                )
            )
    } catch (error: any) {
        logger.error('Error on getUsersController: ', error.message)
        return res
            .status(error.status)
            .json(buildResponse('error', error.message, {}))
    }
}

/**
 * Controller for get a user finding by id
 * @param req - Received request
 * @param res - Response to send
 * @returns Promise<Response>
 */
export async function getUserByIdController(
    req: Request,
    res: Response
): Promise<Response> {
    try {
        const userId = req.params.id
        const dbResponse: QueryResult = await getUserByIdDao(userId)

        if (dbResponse.rowCount === 0)
            throw new createError.NotFound(`User with id ${userId} not found`)

        return res
            .status(200)
            .json(
                buildResponse(
                    'success',
                    `User with id ${userId} retrieved successfully`,
                    dbResponse.rows[0]
                )
            )
    } catch (error: any) {
        logger.error('Error on getUserByIdController: ', error.message)
        return res
            .status(error.status)
            .json(buildResponse('error', error.message, {}))
    }
}

/**
 * Controller for create a user
 * @param req - Received request
 * @param res - Response to send
 * @returns Promise<Response>
 */
export async function createUserController(
    req: Request,
    res: Response
): Promise<Response> {
    try {
        const { firstName, lastName, email } = req.body
        const sameEmailUser = await getUserByEmailDao(email)

        if (sameEmailUser.rowCount > 0)
            throw new createError.Conflict(
                `User with email ${email} already exists`
            )

        const dbResponse: QueryResult = await createUserDao(
            firstName,
            lastName,
            email
        )

        const createdUser = dbResponse.rows[0]
        const formattedUser = {
            ...createdUser,
            created_at: createdUser.created_at.toISOString(),
        }

        return res
            .status(201)
            .json(
                buildResponse(
                    'success',
                    'User created successfully',
                    formattedUser
                )
            )
    } catch (error: any) {
        logger.error('Error on createUserController: ', error.message)
        return res
            .status(error.status)
            .json(buildResponse('error', error.message, {}))
    }
}

/**
 * Controller for update a user
 * @param req - Received request
 * @param res - Response to send
 * @returns Promise<Response>
 */
export async function updateUserController(
    req: Request,
    res: Response
): Promise<Response> {
    try {
        const userId = req.params.id
        const getUserDbResponse: QueryResult = await getUserByIdDao(userId)
        if (getUserDbResponse.rowCount === 0)
            throw new createError.NotFound(
                `User with id ${userId} does not exists`
            )

        const { firstName, lastName, email } = req.body
        const sameEmailUser = await getUserByEmailDao(email, userId)

        if (sameEmailUser.rowCount > 0)
            throw new createError.Conflict(
                `User with email ${email} already exists`
            )

        const response = await updateUserDao(userId, firstName, lastName, email)
        const updatedUser = response.rows[0]
        const formattedUser = {
            ...updatedUser,
            created_at: updatedUser.created_at.toISOString(),
            updated_at: updatedUser.updated_at.toISOString(),
        }

        return res
            .status(200)
            .json(
                buildResponse(
                    'success',
                    `User with id ${userId} updated successfully`,
                    formattedUser
                )
            )
    } catch (error: any) {
        logger.error('Error on updateUserController: ', error.message)
        return res
            .status(error.status)
            .json(buildResponse('error', error.message, {}))
    }
}

/**
 * Controller for delete a user
 * @param req - Received request
 * @param res - Response to send
 * @returns Promise<Response>
 */
export async function deleteUserController(
    req: Request,
    res: Response
): Promise<Response> {
    try {
        const userId = req.params.id
        const getUserDbResponse: QueryResult = await getUserByIdDao(userId)
        if (getUserDbResponse.rowCount === 0)
            throw new createError.NotFound(
                `User with id ${userId} does not exists`
            )

        await deleteUserDao(userId)
        return res
            .status(200)
            .json(
                buildResponse(
                    'success',
                    `User with id ${userId} deleted successfully`,
                    {}
                )
            )
    } catch (error: any) {
        logger.error('Error on deleteUserController: ', error.message)
        return res
            .status(error.status)
            .json(buildResponse('error', error.message, {}))
    }
}
