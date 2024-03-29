import { validatePassword, createHash, timestamp } from './../../helpers/utils.js'
import { config } from "./../../config/config.js"
import GetSessionDataDto from "./../dto/session-data-dto.js"
import userModel from "../persistence/mongodb/models/user-model.js"
import { generateEmailToken, verifyEmailToken } from "./../../helpers/token/token-functions.js"
import { sendResetPassword } from "./../../helpers/email/reset-password.js"

export default class SessionController {
    async register (req, res, next) {
        req.logger.info('User registered successfully')
        res.json({ 
            status: "success", 
            message: "User registered"
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
            
            let role = req.user.role
            let isValid = validatePassword(config.auth.pass, req.user)
            req.user.email == config.auth.email && isValid == true ? role = 'admin' : role = req.user.role
        
            req.session.user = {
                first_name: `${ req.user.first_name }`,
                last_name: `${ req.user.last_name }`,
                email: req.user.email,
                age: req.user.age,
                role: req.user.role,
                cart: req.user.cart,
                last_connection: timestamp()
            }
            let userFilter = { email: req.user.email }
            let userUpdate = { last_connection: timestamp() }
            await userModel.findOneAndUpdate(userFilter, userUpdate)
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

    async logout (req, res, next) {
        try {
            req.session.destroy(err => {
                if(err) {
                    return res.status(500).json({
                        status: "error",
                        error: "Session could not be closed"
                    })
                }
            })
            let userFilter = { email: req.user.email }
            let userUpdate = { last_connection: timestamp() }
            await userModel.findOneAndUpdate(userFilter, userUpdate)
            return res.redirect('/')
        } catch (error) {
            res.json({ 
                status: "error", 
                message: "logout failed"
            })
        }
    }

    async forgottenPassword (req, res, next) {
        try {
            const { email } = req.body
            const user = await userModel.findOne({ email: email})
            if(!user){
                return res.status(400).json({
                    status: "error",
                    error: "User does not exist"
                })
            }
            const token = generateEmailToken(email, 3600)
            await sendResetPassword(email, token)
            return res.redirect('/reset-password-mail')
        } catch (error) {
            res.json({ 
                status: "error", 
                message: error.message
            })
        }
    }

    async resetPassword (req, res, next) {
        try {
            const token = req.query.token
            const { email, newPassword } = req.body
            const validEmail = verifyEmailToken(token) 
            if (!validEmail){
                return res.redirect('/reset-password-expired-token-mail')
            }
            const user = await userModel.findOne({ email: email})
            if (!user){
                return res.status(400).json({
                    status: "error",
                    error: "User does not exist"
                })
            }
            if (validatePassword(newPassword, user)) {
                return res.send("No puedes usar la misma contraseña.")
            }
            const userData = {
                ...user._doc,
                password: createHash(newPassword)
            }
            await userModel.findOneAndUpdate({ email: email }, userData)
            return res.redirect('/reset-password-success')
        } catch (error) {
            res.json({ 
                status: "error", 
                message: error.message
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