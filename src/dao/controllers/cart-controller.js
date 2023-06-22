import { CartsServicesMongo } from './../services/carts-services-mongodb.js'

const cartServices = new CartsServicesMongo()

export default class CartController {
    async getCarts (req,res) {
        try {
            const carts = await cartServices.getCarts()
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

    async addCart (req,res) {
        try {
            const newCart = await cartServices.addCart()
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
            const cart = await cartServices.getCartById(cid)
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
            const updatedCart = await cartServices.addProductToCart(cartId, productId)
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
            const updatedCart = await cartServices.updateProductQuantityInCart(cartId, productId, newQuantity)
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
            const updatedCart = await cartServices.updateFullCart(cartId, productsList)
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
            let updatedCart = await cartServices.deleteEveryProductInCart(cartId)
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
            let updatedCart = await cartServices.deleteProductInCart(cartId, productId)
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