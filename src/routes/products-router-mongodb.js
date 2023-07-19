import { Router } from 'express'
import ProductsController from './../dao/controllers/products-controller.js'
import { handlePolicies } from './../middlewares/policies.js'

const router = Router()
const productsController = new ProductsController()

router.get('/', productsController.getProducts)

router.post('/', handlePolicies(['ADMIN']), productsController.createProduct)

router.get('/:id', productsController.getProductById)

router.put('/:id', handlePolicies(['ADMIN']), productsController.updateProduct)

router.delete('/:id', handlePolicies(['ADMIN']), productsController.deleteProduct)

export default router