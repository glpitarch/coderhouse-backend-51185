import ticketModel from "./../models/ticket-model.js"
import cartModel from './../models/carts-model.js'
import productModel from "./../models/products-model.js"

export class TicketManagerMongo {

    async getTickets() {
        try {
            const tickets = await ticketModel.find()
            return tickets
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async checkOutProductsQuantity(cartId)  {
        try {
            let cart = await cartModel.findById(cartId).populate('products._id').lean()
            let productsInCart = cart.products
            let productsInStock = []
            let productsOutOfStock = []
            for (let product of productsInCart) {
                let id = product._id._id
                let productStock = await productModel.findById(id)
          
                if (productStock.stock >= product.quantity) {
                  let newValue = productStock.stock - product.quantity
                  let productToUpdate = {
                    stock: newValue,
                  }
                  await productModel.findByIdAndUpdate(productStock._id, productToUpdate, { new: true })
                  productsInStock.push(product)
                } else {
                  productsOutOfStock.push(product)
                }
              }
              let result = {
                productsInStock,
                productsOutOfStock
              }
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async createTicket(ticket) {
        try {
            const newTicket = await ticketModel.create(ticket)
            return newTicket
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getTicketById(id) {
        try {
            if (id.trim().length != 24) {
                throw new Error('The ticket ID is not valid')
            }
            const ticket = await ticketModel.findById(id)
            if(ticket){
                return ticket
            }
            throw new Error(`The ticket ID number: ${id} was not found`)
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

