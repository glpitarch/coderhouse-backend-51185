import { Router } from 'express'
import ProductsController from '../dao/controllers/products-controller.js'
import { handlePolicies } from '../middlewares/policies.js'

const router = Router()
const productsController = new ProductsController()

router.get('/', handlePolicies(['PUBLIC']), productsController.getProducts)

router.post('/', handlePolicies(['ADMIN', 'PREMIUM']), productsController.createProduct)

router.get('/:id', handlePolicies(['PUBLIC']), productsController.getProductById)

router.put('/:id', handlePolicies(['ADMIN', 'PREMIUM']), productsController.updateProduct)

router.delete('/:id', handlePolicies(['ADMIN', 'PREMIUM']), productsController.deleteProduct)

export default router