import productModel from './../persistence/mongodb/models/products-model.js'
import { cartsServices, usersServices } from './../repositories/index.js'
import userModel from './../persistence/mongodb/models/user-model.js'
import HandlebarsUtils from './../../helpers/handlebars/hb-utils.js'
import { EError } from './../../helpers/errors/enums/EError.js'
import { CustomError } from './../../helpers/errors/custom-error.js'
import { productQueryErrorInfo } from './../../helpers/errors/products/product-query-error.js'

const handlebarsUtils = new HandlebarsUtils()

export default class ViewsController {
    async register (req, res) {
        try {
            const titleTag = 'Registro'
            res.render('register', { 
                title: titleTag,
                style: 'styles.css'
            })
        } catch (error) {
            res.send({
                error: "error",
                message: error.message
            })
        }
    }

    async registerFailed (req, res) {
        try {
            const titleTag = 'Registro fallido'
            res.render('register-failed', { 
                title: titleTag,
                style: 'styles.css'
            })
        } catch (error) {
            res.send({
                error: "error",
                message: error.message
            })
        }
    }

    async registerSuccess (req, res) {
        try {
            const titleTag = 'Registro exitoso'
            res.render('register-success', { 
                title: titleTag,
                style: 'styles.css'
            })
        } catch (error) {
            res.send({
                error: "error",
                message: error.message
            })
        }
    }

    async login (req, res) {
        try {
            const titleTag = 'login'
            res.render('login', { 
                title: titleTag,
                style: 'styles.css'
            })
        } catch (error) {
            res.send({
                error: "error",
                message: error.message
            })
        }
    }  

    async forgottenPassword (req, res) {
        try {
            const titleTag = 'Contraseña olvidada'
            res.render('forgotten-password', { 
                title: titleTag,
                style: 'styles.css'
            })
        } catch (error) {
            res.send({
                error: "error",
                message: error.message
            })
        }
    }

    async resetPasswordMailConfirmation (req, res) {
        try {
            const titleTag = 'Email confirmation'
            res.render('reset-password-mail', { 
                title: titleTag,
                style: 'styles.css'
            })
        } catch (error) {
            res.send({
                error: "error",
                message: error.message
            })
        }
    }

    async resetPasswordMailExpired (req, res) {
        try {
            const titleTag = 'Password link expired'
            res.render('reset-password-expired-token-mail', { 
                title: titleTag,
                style: 'styles.css'
            })
        } catch (error) {
            res.send({
                error: "error",
                message: error.message
            })
        }
    }

    async resetPassword (req, res) {
        try {
            const titleTag = 'Restablecer contraseña'
            const token = req.query.token
            res.render('reset-password', { 
                title: titleTag,
                style: 'styles.css',
                token: token
            })
        } catch (error) {
            res.send({
                error: "error",
                message: error.message
            })
        }
    }

    async successfullyUserRequest (req, res) {
        try {
            const titleTag = 'Petición exitosa'
            res.render('successfully-user-request', { 
                title: titleTag,
                style: 'styles.css'
            })
        } catch (error) {
            res.send({
                error: "error",
                message: error.message
            })
        }
    }

    async profile (req, res) {
        try {
            const titleTag = 'Perfil'
            let user = req.session.user
            let userData = await userModel.findOne({ email: user.email })
            user._id = userData._id
            user.documents = userData.documents
            user.docs_status = userData.docs_status
            let userDocumentation
            if (user.docs_status.overall === 'incompleto' || user.docs_status.overall === 'pendiente') {
                userDocumentation = await usersServices.checkDocumentation(userData)
            }
            const isDocumentationIncomplete = user.docs_status.overall === 'incompleto' || user.docs_status.overall === 'pendiente'
            const isAdmin = await handlebarsUtils.isAdmin(user)
            const isExternalAcces = await handlebarsUtils.isExternalAcces(user)
            res.render('profile', {
                user,
                userDocumentation,
                isAdmin,
                isExternalAcces,
                isDocumentationIncomplete,
                title: titleTag,
                style: 'styles.css'
            })
        } catch (error) {
            res.send({
                error: "error",
                message: error.message
            })
        }
    }

    async updateRole (req, res) {
        try {
            const titleTag = 'Cambiar rol'
            let user = req.session.user
            const isAdmin = await handlebarsUtils.isAdmin(user)
            const isExternalAcces = await handlebarsUtils.isExternalAcces(user)

            const regex = /^[0-9]*$/
            let query = req.query.query
            let limit = parseInt(req.query.limit)
            let sort = req.query.sort
            let { page = 1 } = req.query

            let isNumber = regex.test(page)
            if(page < 0 || isNumber == false || page.length > 3) {
                CustomError.createError({
                    name: "Invalid query",
                    message: "An error occurred trying to get HTTP query",
                    cause: productQueryErrorInfo(query),
                    errorCode: EError.INVALID_QUERY,
                })
            }
        
            let queryFilter = {}
            if (query) {
                queryFilter = JSON.parse(query)
            }
        
            let limitOption = 10
            if (limit) {
                limitOption = limit
            }
        
            let sortOption = {}
            if (sort == 'asc') {
                sortOption = { role: 1 }
            } else if (sort == 'desc') {
                sortOption = { role: -1 }
            }
            const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await userModel.paginate( queryFilter, 
                { limit: limitOption, 
                    page: page, 
                    sort: sortOption, 
                    lean: true }
            )
            let users = docs
            res.render('update-role', {
                user,
                users,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                isAdmin,
                isExternalAcces,
                title: titleTag,
                style: 'styles.css'
            })
        } catch (error) {
            res.send({
                error: "error",
                message: error.message
            })
        }
    }

    async products (req, res, next) {
        try {
            const titleTag = 'Productos'

            let user = req.session.user
            const isAdmin = await handlebarsUtils.isAdmin(user)
            const isExternalAcces = await handlebarsUtils.isExternalAcces(user)

            const regex = /^[0-9]*$/
            let query = req.query.query
            let limit = parseInt(req.query.limit)
            let sort = req.query.sort
            let { page = 1 } = req.query

            let isNumber = regex.test(page)
            if(page < 0 || isNumber == false || page.length > 3) {
                CustomError.createError({
                    name: "Invalid query",
                    message: "An error occurred trying to get HTTP query",
                    cause: productQueryErrorInfo(query),
                    errorCode: EError.INVALID_QUERY,
                })
            }
        
            let queryFilter = {}
            if (query) {
                queryFilter = JSON.parse(query)
            }
        
            let limitOption = 10
            if (limit) {
                limitOption = limit
            }
        
            let sortOption = {}
            if (sort == 'asc') {
                sortOption = { price: 1 }
            } else if (sort == 'desc') {
                sortOption = { price: -1 }
            }
            
            const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await productModel.paginate( queryFilter, 
                { limit: limitOption, 
                    page: page, 
                    sort: sortOption, 
                    lean: true }
            )
        
            let products = docs
            let productsLength = products.length
        
            let searchError = ''
            if (productsLength === 0) {
                searchError = 'No se ha encontrado ningun producto con los filtros solicitados'
            }
        
            const cid = user.cart._id
            products = await handlebarsUtils.addCartIdToProducts(cid, products)

            res.render('products', { 
                title: titleTag,
                style: 'styles.css',
                products,
                user,
                isAdmin,
                isExternalAcces,
                searchError,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage
            })
        } catch (error) {
            next(error)
        }
    }

    async chat (req, res) {
        try {
            const titleTag = 'Online Chat'
            let user = req.session.user
            const isAdmin = await handlebarsUtils.isAdmin(user)
            const isExternalAcces = await handlebarsUtils.isExternalAcces(user)
            res.render('chat', { 
                title: titleTag,
                style: 'styles.css',
                user,
                isAdmin,
                isExternalAcces
            })
        } catch (error) {
            res.send({
                error: "error",
                message: error.message
            })
        }
    }

    async realTimeProducts (req, res) {
        try {
            const titleTag = 'Real time products'
            let user = req.session.user
            const isAdmin = await handlebarsUtils.isAdmin(user)
            const isExternalAcces = await handlebarsUtils.isExternalAcces(user)
            res.render('realTimeProducts', { 
                title: titleTag,
                style: 'styles.css',
                user,
                isAdmin,
                isExternalAcces
            })
        } catch (error) {
            res.send({
                error: "error",
                message: error.message
            })
        }
    }

    async cart (req, res) {
        const titleTag = 'Cart'
        try {
            let user = req.session.user
            const isAdmin = await handlebarsUtils.isAdmin(user)
            const isExternalAcces = await handlebarsUtils.isExternalAcces(user)
            const cid = user.cart._id
            let cart = await cartsServices.getCartById(cid)
            cart = cart.toObject()
            let productsInCart = cart.products
            const totalPricePucharse = await handlebarsUtils.totalPricePucharse(productsInCart)
            res.render('cart', { 
                title: titleTag,
                style: 'styles.css',
                productsInCart,
                totalPricePucharse,
                user,
                isAdmin,
                isExternalAcces
            })
        } catch (error) {
            res.send({
                error: "error",
                message: error.message
            })
        }
    }
}