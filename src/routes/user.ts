import { Router } from 'express'
import {
    createUserController,
    deleteUserController,
    getUserByIdController,
    getUsersController,
    updateUserController,
} from '../controllers/user'
import {
    createUserValidator,
    deleteUserValidator,
    getUserByIdValidator,
    updateUserValidator,
} from '../validators/user'

const router = Router()

router.get('/', getUsersController)
router.get('/:id', getUserByIdValidator, getUserByIdController)
router.post('/', createUserValidator, createUserController)
router.put('/:id', updateUserValidator, updateUserController)
router.delete('/:id', deleteUserValidator, deleteUserController)

export default router
