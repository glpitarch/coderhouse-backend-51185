import { Router } from 'express'
import CartsController from './../dao/controllers/carts-controller.js'
import TicketController from './../dao/controllers/ticket-controller.js'
import { handlePolicies } from './../middlewares/policies.js'

const router = Router()
const cartsController = new CartsController()
const ticketController = new TicketController()

router.post('/', cartsController.createCart)

router.get('/', cartsController.getCarts)

router.get('/:cid', cartsController.getCartById)

router.post('/:cid/product/:pid', handlePolicies(['ONLY_USERS']), cartsController.addProductToCart)

router.post('/:cid/purchase', ticketController.createTicket)

router.post('/purchase/email/confirmation', ticketController.purchaseEmail)

router.put('/:cid/product/:pid', cartsController.updateProductQuantityInCart)

router.put('/:cid', cartsController.updateFullCart)

router.delete('/:cid', cartsController.deleteEveryProductInCart)

router.delete('/:cid/products/:pid', cartsController.deleteProductInCart)

export default router