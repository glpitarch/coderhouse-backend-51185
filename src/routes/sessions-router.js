import { Router } from 'express'
import passport from 'passport'
import { authSession } from './../middlewares/auth-session.js'
import SessionController from './../dao/controllers/session-controller.js'

const router = Router()
const sessionController = new SessionController()

router.post('/register', passport.authenticate('register', { failureRedirect:'/registerFailed' }), sessionController.register)

router.get('/registerFailed', sessionController.registerFailed)

router.post('/login', passport.authenticate('login', { failureRedirect: '/loginFailed' }), sessionController.login)

router.get('/loginFailed', sessionController.loginFailed)

router.get('/logout', sessionController.logout)

router.post('/forgotten-password', sessionController.forgottenPassword)

router.post('/reset-password', sessionController.resetPassword)

router.get('/current', authSession, sessionController.currentSessionData)

router.get('/github', passport.authenticate('github'))

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), sessionController.githubCallback)

export default router
