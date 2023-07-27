import { cartsDao, productsDao, ticketsDao, usersDao } from './../factory.js'
import { ProductsRepository } from './products-repository.js'
import { CartsRepository } from './carts-repository.js'
import { TicketRepository } from './ticket-repository.js'
import { UsersRepository } from './users-repository.js'

export const productsServices = new ProductsRepository(productsDao)
export const cartsServices = new CartsRepository(cartsDao)
export const ticketServices = new TicketRepository(ticketsDao)
export const usersServices = new UsersRepository(usersDao)