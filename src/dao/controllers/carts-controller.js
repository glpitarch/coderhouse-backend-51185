import { cartsServices } from '../repositories/index.js'

export default class CartsController {
    async getCarts (req,res) {
        try {
            const carts = await cartsServices.getCarts()
            res.json({
                status: "success",
                result: carts
        })
        } catch (error) {
            res.status(400).json({
                status: "error",
                error: error.message
            })
        }
    }

    async createCart (req,res) {
        try {
            const newCart = await cartsServices.createCart()
            res.json({
                status: "success",
                result: newCart
            }) 
        } catch (error) {
            res.status(400).json({
                status: "error",
                error: error.message
            })
        }
    }

    async getCartById (req,res) {
        try {
            const cid = req.params.cid
            const cart = await cartsServices.getCartById(cid)
            res.json({
                status: "success",
                result: cart
            })
        } catch (error) {
            res.status(400).json({
                status: "error",
                error: error.message
            })
        }
    }

    async addProductToCart (req,res) {
        try {
            const cartId = req.params.cid
            const productId = req.params.pid
            const updatedCart = await cartsServices.addProductToCart(cartId, productId)
            res.json({
                status: "success",
                result: updatedCart
            })
        } catch (error) {
            res.status(400).json({
                status: "error",
                error: error.message
            })
        }
    }
    
    async updateProductQuantityInCart (req,res) {
        try {
            const cartId = req.params.cid
            const productId = req.params.pid
            const newQuantity = req.body
            const updatedCart = await cartsServices.updateProductQuantityInCart(cartId, productId, newQuantity)
            res.json({
                status: "success",
                result: updatedCart
            })
        } catch (error) {
            res.status(400).json({
                status: "error",
                error: error.message
            })
        }
    }

    async updateFullCart (req,res) {
        try {
            const cartId = req.params.cid
            const productsList = req.body
            const updatedCart = await cartsServices.updateFullCart(cartId, productsList)
            res.json({
                status: "success",
                result: updatedCart
            })
        } catch (error) {
            res.status(400).json({
                status: "error",
                error: error.message
            })
        }
    }

    async deleteEveryProductInCart (req,res) {
        try {
            const cartId = req.params.cid
            let updatedCart = await cartsServices.deleteEveryProductInCart(cartId)
            res.json({
                status: "success",
                result: updatedCart
            })
        } catch (error) {
            res.status(400).json({
                status: "error",
                error: error.message
            })
        }
    }

    async deleteProductInCart (req,res) {
        try {
            const cartId = req.params.cid
            const productId = req.params.pid
            let updatedCart = await cartsServices.deleteProductInCart(cartId, productId)
            res.json({
                status: "success",
                result: updatedCart
            })
        } catch (error) {
            res.status(400).json({
                status: "error",
                error: error.message
            })
        }
    }
}