import mongoose from "mongoose"
import cartModel from './../models/carts-model.js'
import { CustomError } from "./../../../../helpers/errors/custom-error.js"
import { idErrorInfo } from "./../../../../helpers/errors/general/invalid-id-error.js"
import { EError } from "./../../../../helpers/errors/enums/EError.js"
import { nonexistentIdErrorInfo } from "./../../../../helpers/errors/general/nonexistent-id-error.js"

export class CartsManagerMongo {

    async getCarts() {
        try {
            const carts = await cartModel.find()
            return carts
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async createCart() {
        try {
            let cart = {
                products: []
            }
            const newCart = await cartModel.create(cart)
            return newCart
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getCartById(id) {
        try {
            if (id.length != 24) {
                CustomError.createError({
                    name: "Invalid ID param",
                    message: "An error occurred trying to get HTTP ID parameter",
                    cause: idErrorInfo(id),
                    errorCode: EError.INVALID_PARAM,
                })
            }
            const cart = await cartModel.findById(id).populate('products._id')
            if(cart){
                return cart
            }
            throw new Error(`The cart ID number: ${id} was not found`)
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const isValidCartId = mongoose.Types.ObjectId.isValid(cartId)
            if (!isValidCartId) {
                throw new Error ('Cart ID does not exist')
            }
            let cartToUpdate = await cartModel.findById(cartId)

            const isValidProductId = mongoose.Types.ObjectId.isValid(productId)
            if (!isValidProductId) {
                throw new Error ('Product ID does not exist')
            }
            let doesTheProductExist = cartToUpdate.products.findIndex(product => product._id == productId)
            if (doesTheProductExist != -1) {
                let qty = cartToUpdate.products[doesTheProductExist].quantity
                qty += 1
                let result = await cartModel.updateOne(
                    { _id: cartId, 'products._id': productId },
                    { $set:{ 'products.$.quantity': qty }}
                )
                return result
            } else {
                let product = {
                    _id: productId,
                    quantity: 1
                }
                let result = await cartModel.updateOne({ _id: cartId }, { $push: { 'products': product }})
                return result
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateProductQuantityInCart(cartId, productId, newQuantity) {
        try {
            const isValidCartId = mongoose.Types.ObjectId.isValid(cartId)
            if (!isValidCartId) {
                throw new Error ('Cart ID does not exist')
            }
            let cartToUpdate = await cartModel.findById(cartId)

            const isValidProductId = mongoose.Types.ObjectId.isValid(productId)
            if (!isValidProductId) {
                throw new Error ('Product ID does not exist')
            }

            let isNumber = typeof newQuantity.quantity == 'number'
            let isGreaterThan = newQuantity.quantity > 0
            if(isNumber != true || isGreaterThan != true) {
                 throw new Error ('The quantity value that you have entered is not a correct value!. Quantity value must be a number greater than 0')
            }
            
            let doesTheProductExist = cartToUpdate.products.findIndex(product => product._id == productId)
            if (doesTheProductExist != -1) {
                const result = await cartModel.updateOne(
                    { _id: cartId, 'products._id': productId },
                    { $set:{ 'products.$.quantity': newQuantity.quantity }}
                )
                return result
            } else {
                throw new Error ('Product does not exist in cart')
            }
        } catch (error) {
            throw new Error(error.message)
        }
    } 

    async updateFullCart(cartId, productsList) {
        try {
            const isValidCartId = mongoose.Types.ObjectId.isValid(cartId)
            if (!isValidCartId) {
                throw new Error ('Cart ID does not exist')
            }
            let cartToUpdate = await cartModel.findById(cartId)

            const isValidId = (productId) => {
                let isValid = mongoose.Types.ObjectId.isValid(productId)
                return isValid
            }

            for (const product of productsList) {

                let isValid = isValidId(product._id)
                if (!isValid) {
                    return ` Product ID: ${ product._id } does not exist`
                }
        
                let doesTheProductExist = cartToUpdate.products.findIndex(item => item._id == product._id)
        
                if (doesTheProductExist != -1) {
                    cartToUpdate.products[doesTheProductExist].quantity = cartToUpdate.products[doesTheProductExist].quantity + product.quantity
                } else {
                    cartToUpdate.products.push(product)
                }
            }

            let result = await cartModel.updateOne(
                { _id: cartId },
                { $set:{ 'products': cartToUpdate.products }}
            )
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async deleteProductInCart(cartId, productId) {
        try {
            const isValidCartId = mongoose.Types.ObjectId.isValid(cartId)
            if (!isValidCartId) {
                throw new Error ('Cart ID does not exist')
            }
            let cartToUpdate = await cartModel.findById(cartId)
            let doesTheProductExist = cartToUpdate.products.findIndex(product => product._id == productId)
            if (doesTheProductExist == -1) {
                throw new Error ('Product does not exist in cart')
            } else {
                cartToUpdate.products.splice(doesTheProductExist, 1)
                let result = await cartModel.updateOne({ _id: cartId }, { $set: { 'products': cartToUpdate.products }})
                return result
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async cleaningCartPostPurchase(cartId, inStock) {
        try {
            let result = []
            for (const product of inStock) {
                let productId = product._id._id.toString()
                 let productDeleted = await this.deleteProductInCart(cartId, productId)
                 result.push(productDeleted)
            }
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async deleteEveryProductInCart(cartId) {
        try {
            const isValidCartId = mongoose.Types.ObjectId.isValid(cartId)
            if (!isValidCartId) {
                throw new Error ('Cart ID does not exist')
            }
            let cartToUpdate = await cartModel.findById(cartId)
            cartToUpdate.products.splice(0)
            const result = await cartModel.updateOne({ _id: cartId }, { $set: { 'products': cartToUpdate.products }})
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }
}
