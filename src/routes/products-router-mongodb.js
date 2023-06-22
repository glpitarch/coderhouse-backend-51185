import { Router } from 'express'
import ProductController from './../dao/controllers/product-controller.js'
import { newProductValidation } from './../middlewares/new-product-validation.js'

const router = Router()
const productController = new ProductController()

router.get('/', productController.getProducts)

router.post('/', newProductValidation, productController.addProduct)

router.get('/:id', productController.getProductById)

router.put('/:id', productController.updateProduct)

router.delete('/:id', productController.deleteProduct)

export default router