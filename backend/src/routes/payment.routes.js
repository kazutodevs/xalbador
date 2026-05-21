import { Router } from 'express'
import * as paymentController from '../controllers/payment.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/create', authenticate, paymentController.createPayment)
router.post('/callback', paymentController.paymentCallback)
router.post('/verify', authenticate, paymentController.verifyPayment)

export default router
