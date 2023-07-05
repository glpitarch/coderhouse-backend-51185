import { cartsDao, productsDao, ticketsDao } from './../factory.js'
import { ProductsServices } from './products-repository.js'
import { CartsServices } from './carts-repository.js'
import { TicketServices } from './ticket-repository.js'

export const productsServices = new ProductsServices(productsDao)
export const cartsServices = new CartsServices(cartsDao)
export const ticketServices = new TicketServices(ticketsDao)