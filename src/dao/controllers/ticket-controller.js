import { cartsServices, ticketServices } from './../repositories/index.js'
import { transporter, emailMailerAccount } from '../../config/gmail-config.js'
import { purchaseEmailTemplate } from '../../helpers/email/email-purchase.js'

export default class TicketController {

    async getTickets (req,res) {
        try {
            const tickets = await ticketServices.getTickets()
            res.json({
                status: "success",
                result: tickets
        })
        } catch (error) {
            res.status(400).json({
                status: "error",
                error: error.message
            })
        }
    }

    async checkOutProductsQuantity (req,res) {
        try {
            const cartId = req.params.cid
            const result = await ticketServices.checkOutProductsQuantity(cartId)
            res.json({
                status: "success",
                result: result
            }) 
        } catch (error) {
            res.status(400).json({
                status: "error",
                error: error.message
            })
        }
    }

    async totalPricePucharse(inStock) {
        try {
            const result = await ticketServices.totalPricePucharse(inStock)
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async createTicket (req,res) {
        try {
            const cartId = req.params.cid
            const products = await ticketServices.checkOutProductsQuantity(cartId)
            const inStock = products.productsInStock   
            const outOfStock = products.productsOutOfStock
            if (inStock.length == 0 && outOfStock.length == 0) {
                throw new Error("There must be at least 1 product in cart to continue")
            }
            const totalPricePucharse = await ticketServices.totalPricePucharse(inStock)
            if (!req.session.user) {
                throw new Error("User not authenticated")
            }
            const purchaser = req.session.user.email
            const ticket = await ticketServices.createTicket(totalPricePucharse, purchaser)
            const result = {
                ticket: ticket,
                productsOutOfStock: outOfStock
            }
            for (const product of inStock) {
                let productId = product._id._id.toString()
                await cartsServices.deleteProductInCart(cartId, productId)
            }
            res.json({
                status: "success",
                result: result
            })
        } catch (error) {
            res.status(400).json({
                status: "error",
                error: error.message
            })
        }
    }

    async getTicketById (req,res) {
        try {
            const tid = req.params.tid
            const ticket = await ticketServices.getTicketById(tid)
            res.json({
                status: "success",
                result: ticket
            })
        } catch (error) {
            res.status(400).json({
                status: "error",
                error: error.message
            })
        }
    }

    async purchaseEmail (req,res) {
        try {
            const userEmail = req.headers['user-email']
            console.log(userEmail)
            purchaseEmailTemplate
            const email = await transporter.sendMail({
                from: emailMailerAccount,
                to: userEmail,
                subject: "Confirmación de pedido",
                html: purchaseEmailTemplate
            })
            console.log("email", email);
            res.json({
                status: "sucess", 
                message: error.message
            })
        } catch (error) {
            res.json({
                status: "error",
                message: error.message
            })
        }  
    }
}