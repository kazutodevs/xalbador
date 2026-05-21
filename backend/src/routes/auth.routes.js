import { Router } from 'express'
import * as authController from '../controllers/auth.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/google', authController.googleLogin)
router.get('/discord', authController.discordLogin)
router.get('/callback', authController.oauthCallback)
router.get('/session', authenticate, authController.getSession)
router.post('/logout', authenticate, authController.logout)

export default router
