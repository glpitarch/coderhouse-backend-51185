import { Router } from 'express'
import CartController from './../dao/controllers/cart-controller.js'

const router = Router()
const cartController = new CartController()

router.post('/', cartController.addCart)

router.get('/', cartController.getCarts)

router.get('/:cid', cartController.getCartById)

router.post('/:cid/product/:pid', cartController.addProductToCart)

router.put('/:cid/product/:pid', cartController.updateProductQuantityInCart)

router.put('/:cid', cartController.updateFullCart)

router.delete('/:cid', cartController.deleteEveryProductInCart)

router.delete('/:cid/products/:pid', cartController.deleteProductInCart)

export default router