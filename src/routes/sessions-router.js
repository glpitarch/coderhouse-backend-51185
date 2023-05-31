import { Router } from 'express'
import passport from 'passport'
import { validatePassword } from './../utils.js'

const router = Router()

router.post('/register', passport.authenticate('register', { failureRedirect:'/failregister'} ), async (req, res) => {

    res.send({ 
        status:"succes", 
        message:"User registered"
    })

})

router.get('/failregister', async (req,res) => {
    console.log('Registration failed')
    res.send({ error: 'Registration failed' })
})

router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), async (req,res) => {

    if(!req.user){
        return res.status(400).send({
            status: "error",
            error: "Incorrect data"
        })
    }

    let role = ''
    let isValid = validatePassword('adminCod3r123', req.user)
    req.user.email == 'adminCoder@coder.com' && isValid == true ? role = 'Administrador' : role = 'Usuario'

    req.session.user = {
        name: `${ req.user.first_name } ${ req.user.last_name }`,
        email: req.user.email,
        age: req.user.age,
        role: role
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

router.get('/github', passport.authenticate('github', { scope: ['user: email'] }), async (req,res) => {})

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req,res) => {

    req.session.user = req.user
    res.redirect('/products')
})

export default router;
