import { v4 as uuidv4 } from "uuid"

class TicketRepository {
    constructor(ticketDao){
        this.ticketDao = ticketDao
    }

    async getTickets() {
        try {
            const tickets = await ticketDao.getTickets()
            return tickets
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async checkOutProductsQuantity(cartId) {
        try {
            const result = await this.ticketDao.checkOutProductsQuantity(cartId)
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async totalPricePucharse(inStock) {
        try {
            let totalPrices = []
            inStock.forEach(product => {
                let totalPriceItem = product._id.price * product.quantity
                totalPrices.push(totalPriceItem)
            })
            let totalPricePucharse = 0
            if (inStock.length > 0) {
                totalPricePucharse = totalPrices.reduce((acc, price) => {
                    return acc + price
                })
            }
            return totalPricePucharse
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async createTicket(totalPricePucharse, purchaser) {
        try {
            const ticketCode = uuidv4()
            let ticketData = {
                code: ticketCode,
                amount: totalPricePucharse,
                purchaser: purchaser
            }
            const newTicket = await this.ticketDao.createTicket(ticketData)
            return newTicket
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getTicketById(id) {
        try {
            const ticket = await this.ticketDao.getTicketById(id)
            return ticket
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

export { TicketRepository }