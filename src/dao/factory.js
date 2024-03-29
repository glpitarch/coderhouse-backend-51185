import { config } from "./../config/config.js"

const persistence = config.server.persistence

let cartsDao
let productsDao
let ticketsDao
let usersDao

switch (persistence) {
    case "mongo":
        const { CartsManagerMongo } = await import("./persistence/mongodb/managers/carts-manager-mongodb.js")
        cartsDao = new CartsManagerMongo()
        const { ProductsManagerMongo } = await import("./persistence/mongodb/managers/products-manager-mongodb.js")
        productsDao = new ProductsManagerMongo()
        const { TicketManagerMongo } = await import("./persistence/mongodb/managers/ticket-manager-mongodb.js")
        ticketsDao = new TicketManagerMongo()
        const { UsersManagerMongo } = await import("./persistence/mongodb/managers/users-manager-mongodb.js")
        usersDao = new UsersManagerMongo()
    break
    
    case "file":
        const { CartsManagerFileSystem } = await import("./persistence/file-system/managers/cart-manager-fs.js")
        cartsDao = new CartsManagerFileSystem()
        const { ProductsManagerFileSystem } = await import("./persistence/file-system/managers/product-manager-fs.js")
        productsDao = new ProductsManagerFileSystem()
    break
}

export { cartsDao, productsDao, ticketsDao, usersDao }