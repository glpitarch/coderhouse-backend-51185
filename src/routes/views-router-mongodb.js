import { Router } from "express"
import { handlePolicies } from './../middlewares/policies.js'
import ViewsController from './../dao/controllers/views-controller.js'

const viewsController = new ViewsController()

const router = Router()

router.get('/', handlePolicies(['PUBLIC']), viewsController.login)

router.get('/register', handlePolicies(['PUBLIC']), viewsController.register)

router.get('/register-success', viewsController.registerSuccess)

router.get('/register-failed', viewsController.registerFailed)

router.get('/forgotten-password', handlePolicies(['PUBLIC']), viewsController.forgottenPassword)

router.get('/reset-password-mail', handlePolicies(['PUBLIC']), viewsController.resetPasswordMailConfirmation)

router.get('/reset-password-expired-token-mail', handlePolicies(['PUBLIC']), viewsController.resetPasswordMailExpired)

router.get('/reset-password', handlePolicies(['PUBLIC']), viewsController.resetPassword)

router.get('/profile', handlePolicies(['PRIVATE']), viewsController.profile)

router.get('/products', handlePolicies(['PRIVATE']), viewsController.products)

router.get('/realtimeproducts', handlePolicies(['ADMIN']), viewsController.realTimeProducts)

router.get('/chat', handlePolicies(['ONLY_USERS']), viewsController.chat)

router.get('/cart', handlePolicies(['PRIVATE']), viewsController.cart)

router.get('/successfully-user-request', handlePolicies(['PUBLIC']), viewsController.successfullyUserRequest)

export default router