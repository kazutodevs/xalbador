import { Router } from 'express'
import * as productsController from '../controllers/products.controller.js'
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware.js'
import multer from 'multer'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

router.get('/', productsController.getProducts)
router.get('/categories', productsController.getCategories)
router.get('/:id', productsController.getProductById)

router.post('/upload', authenticate, authorizeAdmin, upload.single('image'), productsController.uploadImage)
export default router
