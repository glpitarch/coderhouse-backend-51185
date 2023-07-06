import { cartsDao, productsDao, ticketsDao } from './../factory.js'
import { ProductsRepository } from './products-repository.js'
import { CartsRepository } from './carts-repository.js'
import { TicketRepository } from './ticket-repository.js'

export const productsServices = new ProductsRepository(productsDao)
export const cartsServices = new CartsRepository(cartsDao)
export const ticketServices = new TicketRepository(ticketsDao)