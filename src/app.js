/*-----//_ App config _//-----*/
import { config } from './config/config.js'

import express from 'express'
import { dbConnection } from './config/dbConnection.js'
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'
import session from 'express-session'
import passport from 'passport'
import MongoStore from 'connect-mongo'

/*-----//_ Helpers & configs _//-----*/
import __dirname from './utils.js'
import initializePassport from './config/passport-config.js'
import { errorHandler } from './middlewares/error-handler.js'
import { addLogger } from './helpers/logger/logger.js'
import { swaggerSpecs } from './config/doc-config.js'
import swaggerUi from 'swagger-ui-express'
import path from 'path'

/*-----//_ MongoDB _//-----*/
import productModel from './dao/persistence/mongodb/models/products-model.js'
import chatModel from './dao/persistence/mongodb/models/chat-model.js'
import productsRouterMongo from './routes/products-router-mongodb.js'
import cartsRouterMongo from './routes/carts-router-mongodb.js'
import viewsRouterMongo from './routes/views-router-mongodb.js'
import chatRouterMongo from './routes/chat-router-mongodb.js'
import sessionRouter from './routes/sessions-router.js'
import usersRouter from './routes/users-router-mongodb.js'
import loggerRouter from './routes/logger-router.js'
import mocksRouter from './routes/mocks-router.js'

const app = express()

/*-----//_ Data received handler middleware  _//-----*/
app.use(express.json())
app.use(express.urlencoded({extended:true}))

/*-----//_ Handlebars configuration _//-----*/
app.engine('handlebars', handlebars.engine())
app.set('views', path.join(__dirname,'/views'))
app.set('view engine', 'handlebars')

/*-----//_ Database connection  _//-----*/
dbConnection()

const httpServer = app.listen(config.server.port, () => {
    console.log(`
        The server is online on port: ${ config.server.port }
    `)
})

/*-----//_ Static content  _//-----*/
app.use(express.static(__dirname + '/public'))

/*-----//_ Session configuration _//-----*/
app.use(session({
    store: new MongoStore({
        mongoUrl: config.mongo.url,
        ttl: 3600
    }),
    secret: config.secretWord.pass,
    resave: false,
    saveUninitialized: false
}))

/*-----//_ Passport configuration _//-----*/
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

/*-----//_ Logger middleware _//-----*/
app.use(addLogger)

/*-----//_ Routes for MongoDB _//-----*/
app.use('/', viewsRouterMongo)
app.use('/api/products', productsRouterMongo)
app.use('/api/carts', cartsRouterMongo)
app.use('/api/users', usersRouter)
app.use('/api/session', sessionRouter)
app.use('/chat', chatRouterMongo)
app.use('/loggerTest', loggerRouter)
app.use('/mockingproducts', mocksRouter) 
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

/*-----//_ All Routes error handler middleware _//-----*/
app.use(errorHandler)

/*-----//_ Mongodb socket.io _//-----*/
const io = new Server(httpServer)

let products = await productModel.find().lean()
let mongoDbMessages = await chatModel.find().lean()

io.on('connection', socket => {
    console.log('A user has been connected to the server')

    /*-----//_ Listenings and emits for realTimeProducts _//-----*/
    io.emit('productsList', products)

    socket.on('productToDelete', async productId => {
        try {
            await productModel.deleteOne({_id: productId})
            let products = await productModel.find().lean()
            io.emit('productsList', products)
        } catch (error) {
            console.log(error)
        }
    })
    socket.on('productToAdd', async product => {
        try {
            await productModel.create(product)
            let products = await productModel.find().lean()
            io.emit('productsList', products)
        } catch (error) {
            console.log(error)
        }
    })

    /*-----//_ Listenings and emits for Chat _//-----*/
    io.emit('updateMessages', mongoDbMessages)

    socket.on('authenticated', async userEmail => {
        io.emit('newUserConnected', userEmail)
    })

    socket.on('userMessage', async message => {
        try {
            await chatModel.create(message)
            let chatHistorial = await chatModel.find().lean()
            io.emit('updateMessages', chatHistorial)
        } catch (error) {
            console.log(error)
        }
    })
})



