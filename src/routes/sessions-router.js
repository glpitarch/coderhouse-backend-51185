import { Router } from 'express'
import passport from 'passport'
import { validatePassword } from '../utils.js'
import { authSession } from './../middlewares/auth-session.js'
import { config } from './../config/config.js'
import GetSessionDataDto from './../dao/dto/session-data-dto.js'

const router = Router()

router.post('/register', passport.authenticate('register', { failureRedirect:'/failregister'} ), async (req, res) => {
    res.send({ 
        status:"succes", 
        message:"User registered"
    })

})

router.get('/failregister', async (req,res) => {
    res.send({ error: 'Registration failed' })
})

router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), async (req,res) => {
    if(!req.user){
        return res.status(400).send({
            status: "error",
            error: "Incorrect data"
        })
    }
    
    let role = 'user'
    let isValid = validatePassword(config.auth.pass, req.user)
    req.user.email == config.auth.email && isValid == true ? role = 'admin' : role = 'user'

    req.session.user = {
        first_name: `${ req.user.first_name }`,
        last_name: `${ req.user.last_name }`,
        email: req.user.email,
        age: req.user.age,
        role: role,
        cart: req.user.cart
    }
    
    res.send({
        status: "success",
        payload: req.user,
        message: "logged in"
    })
})

router.get('/faillogin', async (req,res) => {
    res.send({ 
        error: 'Login error' 
    })
})

router.get('/logout', (req,res) => {
    req.session.destroy(err => {
        if(err) {
            return res.status(500).send({
                status:"error",
                error:"Session could not be closed"
            })
        }
        res.redirect('/');
    })
})

router.get('/current', authSession, (req,res) => {
    let sessionData = req.session.user
    const userSessionData = new GetSessionDataDto(sessionData)
    res.send({
        status:"success",
        payload: userSessionData
    })
})

router.get('/github', passport.authenticate('github'))

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req,res) => {
    req.session.user = req.user
    res.redirect('/products')
})

export default router;
