import { Router } from "express"
import { handlePolicies } from './../middlewares/policies.js'
import ViewsController from './../dao/controllers/view-controller.js'

const viewsController = new ViewsController()

const router = Router()

router.get('/products', handlePolicies(['PRIVATE']), viewsController.products)

router.get('/carts/:cid', handlePolicies(['PRIVATE']), viewsController.cart)

router.get('/realtimeproducts', handlePolicies(['ADMIN']), viewsController.realTimeProducts)

router.get('/chat', handlePolicies(['ONLY_USERS']), viewsController.chat)

router.get('/register', handlePolicies(['PUBLIC']), viewsController.register)

router.get('/', handlePolicies(['PUBLIC']), viewsController.login)

router.get('/profile', handlePolicies(['PRIVATE']), viewsController.profile)

export default router