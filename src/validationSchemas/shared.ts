import Joi from 'joi'
import { personalNameRegex } from '../utils/regex'

export const uuidSchema = Joi.string().uuid().required().label('uuid')
export const personalNameSchema = Joi.string().regex(personalNameRegex)
