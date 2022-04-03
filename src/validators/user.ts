import { Request, Response } from 'express'
import createErrors from 'http-errors'
import { userDataSchema } from '../validationSchemas/user'
import { buildResponse } from '../utils/response'
import { uuidSchema } from '../validationSchemas/shared'
import { createLogger } from '../config/logger'

const logger = createLogger('validators/user.ts')

/**
 * Validates the user id sent in request.params
 * @param req - Request received
 * @param res - Response to send
 * @param next - Next middleware
 */
export async function getUserByIdValidator(
    req: Request,
    res: Response,
    next: Function
) {
    const { id } = req.params

    try {
        const userIdValidation = uuidSchema.validate(id)

        if (userIdValidation.error)
            throw new createErrors.BadRequest('Provided user id is not valid')

        next()
    } catch (error: any) {
        logger.error('Error on getUserByIdValidator: ', error.message)
        res.status(error.status).json(buildResponse('error', error.message, {}))
    }
}

/**
 * Validates the body sent in request
 * @param req - Request received
 * @param res - Response to send
 * @param next - Next middleware
 */
export async function createUserValidator(
    req: Request,
    res: Response,
    next: Function
) {
    const { body } = req

    try {
        const bodyValidation = userDataSchema.validate(body)

        if (bodyValidation.error)
            throw new createErrors.BadRequest('Provided body is not valid')

        next()
    } catch (error: any) {
        logger.error('Error on createUserValidator: ', error.message)
        res.status(error.status).json(buildResponse('error', error.message, {}))
    }
}

/**
 * Validates the body sent in request and the user id sent in request.params
 * @param req - Request received
 * @param res - Response to send
 * @param next - Next middleware
 */
export async function updateUserValidator(
    req: Request,
    res: Response,
    next: Function
) {
    const { body } = req
    const { id } = req.params

    try {
        const userIdValidation = uuidSchema.validate(id)

        if (userIdValidation.error)
            throw new createErrors.BadRequest('Provided user id is not valid')

        const bodyValidation = userDataSchema.validate(body)

        if (bodyValidation.error)
            throw new createErrors.BadRequest('Provided body is not valid')

        next()
    } catch (error: any) {
        logger.error('Error on updateUserValidator: ', error.message)
        res.status(error.status).json(buildResponse('error', error.message, {}))
    }
}

/**
 * Validates the user id sent in request.params
 * @param req - Request received
 * @param res - Response to send
 * @param next - Next middleware
 */
export async function deleteUserValidator(
    req: Request,
    res: Response,
    next: Function
) {
    const { id } = req.params

    try {
        const userIdValidation = uuidSchema.validate(id)

        if (userIdValidation.error)
            throw new createErrors.BadRequest('Provided user id is not valid')

        next()
    } catch (error: any) {
        logger.error('Error on deleteUserValidator: ', error.message)
        res.status(error.status).json(buildResponse('error', error.message, {}))
    }
}
