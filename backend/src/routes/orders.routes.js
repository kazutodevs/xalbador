import { Router } from 'express'
import * as paymentController from '../controllers/payment.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/', authenticate, paymentController.getUserOrders)
router.get('/:id', authenticate, paymentController.getOrderById)

export default router
