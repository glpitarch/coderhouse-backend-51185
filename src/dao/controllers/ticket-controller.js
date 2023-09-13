import { cartsServices, ticketServices } from './../repositories/index.js'
import { transporter, emailMailerAccount } from './../../config/gmail-config.js'
import { purchaseEmailTemplate } from './../../helpers/email/email-purchase.js'
import { CustomError } from './../../helpers/errors/custom-error.js'
import { EError } from './../../helpers/errors/enums/EError.js'
import { idErrorInfo } from './../../helpers/errors/general/invalid-id-error.js'
import { authenticationErrorInfo } from './../../helpers/errors/users/authentication-error.js'

export default class TicketController {

    async getTickets (req, res, next) {
        try {
            const tickets = await ticketServices.getTickets()
            res.json({
                status: "success",
                payload: tickets
        })
        } catch (error) {
            next(error)
        }
    }

    async checkOutProductsQuantity (req, res, next) {
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
            const result = await ticketServices.checkOutProductsQuantity(cartId)
            res.json({
                status: "success",
                payload: result
            }) 
        } catch (error) {
            next(error)
        }
    }

    async totalPricePucharse(inStock) {
        try {
            const result = await ticketServices.totalPricePucharse(inStock)
            return result
        } catch (error) {
            next(error)
        }
    }

    async createTicket (req, res, next) {
        try {
            if (!req.session.user) {
                CustomError.createError({
                    name: "Failed autenthication",
                    message: "An error occurred trying to authenticate session",
                    cause: authenticationErrorInfo(),
                    errorCode: EError.AUTH_ERROR,
                })
            }
            const cartId = req.params.cid
            if (cartId.length != 24) {
                CustomError.createError({
                    name: "Invalid ID param",
                    message: "An error occurred trying to get HTTP ID parameter",
                    cause: idErrorInfo(cartId),
                    errorCode: EError.INVALID_PARAM,
                })
            }
            if (req.session.user.cart._id != cartId) {
                throw new Error("The cart ID in user's session does not match with HTTP cart ID parameter")
            }
            const products = await ticketServices.checkOutProductsQuantity(cartId)
            const inStock = products.productsInStock   
            const outOfStock = products.productsOutOfStock
            if (inStock.length === 0 && outOfStock.length === 0) {
                throw new Error("There must be at least 1 product in cart to continue")
            }
            const totalPricePucharse = await ticketServices.totalPricePucharse(inStock)
            const purchaser = req.session.user.email
            const ticket = await ticketServices.createTicket(totalPricePucharse, purchaser)
            const result = {
                ticket: ticket,
                productsOutOfStock: outOfStock,
                purchase_timestamp: ticket.purchase_datetime
            }
            await cartsServices.cleaningCartPostPurchase(cartId, inStock)
            res.json({
                status: "success",
                payload: result
            })
        } catch (error) {
            req.logger.error('An error occurred trying to create a purchase ticket')
            if (error.message === "An error occurred trying to get HTTP ID parameter" || error.message === "An error occurred trying to authenticate session") {
                next(error)
            } else {
                res.json({
                    status: "error",
                    error: error.message
                })
            }
        }
    }

    async getTicketById (req, res, next) {
        try {
            const tid = req.params.tid
            const ticket = await ticketServices.getTicketById(tid)
            res.json({
                status: "success",
                payload: ticket
            })
        } catch (error) {
            next(error)
        }
    }

    async purchaseEmail (req, res) {
        try {
            const { code, purchase_datetime, amount, userEmail, productsOutOfStock } = req.body
            req.logger.info(`Ticket code created: ${ code }`)
            const email = await transporter.sendMail({
                from: emailMailerAccount,
                to: userEmail,
                subject: "Confirmación de pedido",
                html: purchaseEmailTemplate(code, purchase_datetime, amount, productsOutOfStock)
            })
            res.json({
                status: "sucess", 
                message: email
            })
        } catch (error) {
            res.json({
                status: "error",
                message: error.message
            })
        }  
    }
}