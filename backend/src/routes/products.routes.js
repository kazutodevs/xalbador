import { Router } from 'express'
import * as productsController from '../controllers/products.controller.js'
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/', productsController.getProducts)
router.get('/categories', productsController.getCategories)
router.get('/:id', productsController.getProductById)

router.post('/', authenticate, authorizeAdmin, productsController.createProduct)
router.post('/categories', authenticate, authorizeAdmin, productsController.createCategory)

export default router
