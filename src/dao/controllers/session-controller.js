import { validatePassword } from "./../../utils.js"
import { config } from "./../../config/config.js"
import GetSessionDataDto from "./../dto/session-data-dto.js"

export default class SessionController {
    async register (req, res, next) {
        req.logger.info('User registered successfully')
        res.json({ 
            status: "succes", 
            message: "User registered"
        })
    }

    async registerFailed (req, res, next) {
        req.logger.info('User registration failed')
            res.json({ 
                status: "error", 
                message: "User registration failed"
            })
    }

    async login (req, res, next) {
        try {
            if(!req.user){
                return res.status(400).json({
                    status: "error",
                    error: "User does not exist"
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
            res.json({
                status: "success",
                payload: req.user,
                message: "logged in"
            })
        } catch (error) {
            res.json({
                status: "error",
                payload: req.user,
                message: "logged in"
            })
        }
    }

    async loginFailed (req, res, next) {
        res.json({ 
            status: "error", 
            message: "User login failed"
        })
    }

    async logout (req, res, next) {
        try {
            req.session.destroy(err => {
                if(err) {
                    return res.status(500).json({
                        status: "error",
                        error: "Session could not be closed"
                    })
                }
                res.redirect('/');
            })
        } catch (error) {
            res.json({ 
                status: "error", 
                message: "logout failed"
            })
        }
    }

    async currentSessionData (req, res, next) {
        try {
            let sessionData = req.session.user
            const userSessionData = new GetSessionDataDto(sessionData)
            res.json({
                status: "success",
                payload: userSessionData
            })
        } catch (error) {
            req.logger.error('Fail to GET session data')
            res.json({ 
                status: "error", 
                message: "Fail to GET session data"
            })
        }
    }

    async githubCallback (req, res, next) {
        try {
            req.session.user = req.user
            res.redirect('/products')
        } catch (error) {
            req.logger.warning('github callback failed')
            res.json({ 
                status: "error", 
                message: error.message
            })
        }
    }
}