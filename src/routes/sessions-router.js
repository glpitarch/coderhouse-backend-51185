import { Router } from 'express'
import passport from 'passport'
import { handlePolicies } from './../middlewares/policies.js'
import SessionController from './../dao/controllers/session-controller.js'

const router = Router()
const sessionController = new SessionController()

router.post('/register', handlePolicies(['PUBLIC']), passport.authenticate('register'), sessionController.register)

router.post('/login', handlePolicies(['PUBLIC']), passport.authenticate('login'), sessionController.login)

router.get('/logout', handlePolicies(['PRIVATE']), sessionController.logout)

router.post('/forgotten-password', handlePolicies(['PUBLIC']), sessionController.forgottenPassword)

router.post('/reset-password', handlePolicies(['PUBLIC']), sessionController.resetPassword)

router.get('/current', handlePolicies(['PRIVATE']), sessionController.currentSessionData)

router.get('/github', handlePolicies(['PUBLIC']), passport.authenticate('github'))

router.get('/githubcallback', handlePolicies(['PUBLIC']), passport.authenticate('github', { failureRedirect: '/login' }), sessionController.githubCallback)

export default router
