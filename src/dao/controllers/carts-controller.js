import { cartsServices } from './../repositories/index.js'
import { CustomError } from './../../helpers/errors/custom-error.js'
import { EError } from './../../helpers/errors/enums/EError.js'
import { idErrorInfo } from './../../helpers/errors/general/invalid-id-error.js'
import { nonexistentIdErrorInfo } from './../../helpers/errors/general/nonexistent-id-error.js'
import { newQuantityInCartErrorInfo } from './../../helpers/errors/carts/new-quantity-in-cart-error.js'

export default class CartsController {
    async getCarts (req, res, next) {
        try {
            const carts = await cartsServices.getCarts()
            res.json({
                status: "success",
                result: carts
        })
        } catch (error) {
            next(error)
        }
    }

    async createCart (req, res, next) {
        try {
            const newCart = await cartsServices.createCart()
            res.json({
                status: "success",
                result: newCart
            }) 
        } catch (error) {
            next(error)
        }
    }

    async getCartById (req, res, next) {
        try {
            const cid = req.params.cid
            if (cid.length != 24) {
                CustomError.createError({
                    name: "Invalid ID param",
                    message: "An error occurred trying to get HTTP ID parameter",
                    cause: idErrorInfo(cid),
                    errorCode: EError.INVALID_PARAM,
                })
            }
            const cart = await cartsServices.getCartById(cid)
            if (cart === null) {
                CustomError.createError({
                    name: "GET cart error",
                    message: "An error occurred while processing your GET cart request",
                    cause: nonexistentIdErrorInfo(cid),
                    errorCode: EError.DATABASE_ERROR,
                })
            }
            res.json({
                status: "success",
                result: cart
            })
        } catch (error) {
            next(error)
        }
    }

    async addProductToCart (req, res, next) {
        try {
            const cartId = req.params.cid
            if (cartId.length != 24) {
                CustomError.createError({
                    name: "Invalid ID param",
                    message: "An error occurred trying to get HTTP ID parameter",
                    cause: idErrorInfo(cartId),
                    errorCode: EError.INVALID_PARAM,
                })
            }
            const productId = req.params.pid
            if (productId.length != 24) {
                CustomError.createError({
                    name: "Invalid ID param",
                    message: "An error occurred trying to get HTTP ID parameter",
                    cause: idErrorInfo(productId),
                    errorCode: EError.INVALID_PARAM,
                })
            }
            const updatedCart = await cartsServices.addProductToCart(cartId, productId)
            res.json({
                status: "success",
                result: updatedCart
            })
        } catch (error) {
            if (error.message === "An error occurred trying to get HTTP ID parameter") {
                next(error)
            } else {
                res.json({
                    status: "error",
                    error: error.message
                })
            }
        }
    }
    
    async updateProductQuantityInCart (req, res, next) {
        try {
            const cartId = req.params.cid
            if (cartId.length != 24) {
                CustomError.createError({
                    name: "Invalid ID param",
                    message: "An error occurred trying to get HTTP ID parameter",
                    cause: idErrorInfo(cartId),
                    errorCode: EError.INVALID_PARAM,
                })
            }
            const productId = req.params.pid
            if (productId.length != 24) {
                CustomError.createError({
                    name: "Invalid ID param",
                    message: "An error occurred trying to get HTTP ID parameter",
                    cause: idErrorInfo(productId),
                    errorCode: EError.INVALID_PARAM,
                })
            }
            const newQuantity = req.body
            if (newQuantity.quantity < 0) {
                CustomError.createError({
                    name: "Incorrect quantity value",
                    message: "An error occurred trying to update product quantity in cart",
                    cause: newQuantityInCartErrorInfo(productId, cartId, newQuantity),
                    errorCode: EError.INVALID_JSON,
                })
            }
            const updatedCart = await cartsServices.updateProductQuantityInCart(cartId, productId, newQuantity)
            res.json({
                status: "success",
                result: updatedCart
            })
        } catch (error) {
            if (error.message === "An error occurred trying to get HTTP ID parameter" || error.message === "An error occurred trying to update product quantity in cart") {
                next(error)
            } else {
                res.json({
                    status: "error",
                    error: error.message
                })
            }
        }
    }

    async updateFullCart (req, res, next) {
        try {
            const cartId = req.params.cid
            if (cartId.length != 24) {
                CustomError.createError({
                    name: "Invalid ID param",
                    message: "An error occurred trying to get HTTP ID parameter",
                    cause: idErrorInfo(cartId),
                    errorCode: EError.INVALID_PARAM,
                })
            }
            const productsList = req.body
            const updatedCart = await cartsServices.updateFullCart(cartId, productsList)
            res.json({
                status: "success",
                result: updatedCart
            })
        } catch (error) {
            if (error.message === "An error occurred trying to get HTTP ID parameter") {
                next(error)
            } else {
                res.json({
                    status: "error",
                    error: error.message
                })
            }
        }
    }

    async deleteEveryProductInCart (req, res, next) {
        try {
            const cartId = req.params.cid
            if (cartId.length != 24) {
                CustomError.createError({
                    name: "Invalid ID param",
                    message: "An error occurred trying to get HTTP ID parameter",
                    cause: idErrorInfo(cartId),
                    errorCode: EError.INVALID_PARAM,
                })
            }
            let updatedCart = await cartsServices.deleteEveryProductInCart(cartId)
            res.json({
                status: "success",
                result: updatedCart
            })
        } catch (error) {
            if (error.message === "An error occurred trying to get HTTP ID parameter") {
                next(error)
            } else {
                res.json({
                    status: "error",
                    error: error.message
                })
            }
        }
    }

    async deleteProductInCart (req, res, next) {
        try {
            const cartId = req.params.cid
            if (cartId.length != 24) {
                CustomError.createError({
                    name: "Invalid ID param",
                    message: "An error occurred trying to get HTTP ID parameter",
                    cause: idErrorInfo(cartId),
                    errorCode: EError.INVALID_PARAM,
                })
            }
            const productId = req.params.pid
            if (productId.length != 24) {
                CustomError.createError({
                    name: "Invalid ID param",
                    message: "An error occurred trying to get HTTP ID parameter",
                    cause: idErrorInfo(productId),
                    errorCode: EError.INVALID_PARAM,
                })
            }
            let updatedCart = await cartsServices.deleteProductInCart(cartId, productId)
            res.json({
                status: "success",
                result: updatedCart
            })
        } catch (error) {
            if (error.message === "An error occurred trying to get HTTP ID parameter") {
                next(error)
            } else {
                res.json({
                    status: "error",
                    error: error.message
                })
            }
        }
    }
}