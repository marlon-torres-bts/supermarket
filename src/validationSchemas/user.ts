import Joi from 'joi'
import { personalNameSchema } from './shared'

export const userDataSchema = Joi.object()
    .keys({
        firstName: personalNameSchema.required().label('firstName'),
        lastName: personalNameSchema.required().label('lastName'),
        email: Joi.string().email().required().label('email'),
    })
    .required()
    .label('userData')
