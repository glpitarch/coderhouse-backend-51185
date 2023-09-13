import { Router } from 'express'
import CartsController from '../dao/controllers/carts-controller.js'
import TicketController from '../dao/controllers/ticket-controller.js'
import { handlePolicies } from '../middlewares/policies.js'

const router = Router()
const cartsController = new CartsController()
const ticketController = new TicketController()

router.post('/', cartsController.createCart)

router.get('/', handlePolicies(['ADMIN']), cartsController.getCarts)

router.get('/:cid', handlePolicies(['ADMIN']), cartsController.getCartById)

router.put('/:cid', handlePolicies(['ONLY_USERS']), cartsController.updateFullCart)

router.delete('/:cid', handlePolicies(['ONLY_USERS']), cartsController.deleteEveryProductInCart)

router.post('/:cid/product/:pid', handlePolicies(['ONLY_USERS']), cartsController.addProductToCart)

router.put('/:cid/product/:pid', handlePolicies(['ONLY_USERS']), cartsController.updateProductQuantityInCart)

router.delete('/:cid/product/:pid', handlePolicies(['ONLY_USERS']), cartsController.deleteProductInCart)

router.post('/:cid/purchase', handlePolicies(['ONLY_USERS']), ticketController.createTicket)

router.post('/purchase/email/confirmation', handlePolicies(['ONLY_USERS']), ticketController.purchaseEmail)

export default router