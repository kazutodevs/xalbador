import { Router } from 'express'
import * as userController from '../controllers/user.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/profile', authenticate, userController.getProfile)
router.get('/purchases', authenticate, userController.getPurchases)

export default router
