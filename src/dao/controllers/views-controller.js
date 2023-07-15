import productModel from './../persistence/mongodb/models/products-model.js'
import { cartsServices } from './../repositories/index.js'
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

    async profile (req, res) {
        try {
            const titleTag = 'Perfil'
            let user = req.session.user
            const isAdmin = await handlebarsUtils.isAdmin(user)
            const isExternalAcces = await handlebarsUtils.isExternalAcces(user)
            res.render('profile', {
                user: req.session.user,
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
            if (productsLength == 0) {
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
            res.render('realTimeProducts', { 
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