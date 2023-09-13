/*||=====> App config <=====||*/
import { config } from './config/config.js'
import express from 'express'
import { dbConnection } from './config/dbConnection.js'
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'
import session from 'express-session'
import passport from 'passport'
import MongoStore from 'connect-mongo'

/*||=====> Helpers and configs <=====||*/
import __dirname from './absolute-path.js'
import initializePassport from './config/passport-config.js'
import { errorHandler } from './middlewares/error-handler.js'
import { addLogger } from './helpers/logger/logger.js'
import { swaggerSpecs } from './config/doc-config.js'
import swaggerUi from 'swagger-ui-express'
import path from 'path'
import { handlePolicies } from './middlewares/policies.js'

/*||=====> MongoDB Models <=====||*/
import productModel from './dao/persistence/mongodb/models/products-model.js'
import chatModel from './dao/persistence/mongodb/models/chat-model.js'

/*||=====> Routers <=====||*/
import productsRouter from './routes/products-router.js'
import cartsRouter from './routes/carts-router.js'
import viewsRouter from './routes/views-router.js'
import chatRouter from './routes/chat-router.js'
import sessionRouter from './routes/sessions-router.js'
import usersRouter from './routes/users-router.js'
import loggerRouter from './routes/logger-router.js'
import mocksRouter from './routes/mocks-router.js'

const app = express()

/*||=====> Data received handler middleware <=====||*/
app.use(express.json())
app.use(express.urlencoded({extended:true}))

/*||=====> Handlebars configuration <=====||*/
app.engine('handlebars', handlebars.engine())
app.set('views', path.join(__dirname,'/views'))

app.set('view engine', 'handlebars')

/*||=====> Database connection <=====||*/
dbConnection()

const httpServer = app.listen(config.server.port, () => {
    console.log(`
        The server is online on port: ${ config.server.port }
    `)
})

/*||=====> Static content <=====||*/
app.use(express.static(__dirname + '/public'))

/*||=====> Session configuration <=====||*/
app.use(session({
    store: new MongoStore({
        mongoUrl: config.mongo.url,
        ttl: 3600
    }),
    secret: config.secretWord.pass,
    resave: false,
    saveUninitialized: false
}))

/*||=====> Passport configuration <=====||*/
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

/*||=====> Logger middleware <=====||*/
app.use(addLogger)

/*||=====> Routes <=====||*/
app.use('/', viewsRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/users', usersRouter)
app.use('/api/session', sessionRouter)
app.use('/chat', chatRouter)
app.use('/loggerTest', loggerRouter)
app.use('/mockingproducts', mocksRouter) 
app.use('/api/docs', handlePolicies(['ADMIN']), swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

/*||=====> All Routes error handler middleware <=====||*/
app.use(errorHandler)

/*||=====> Mongodb socket.io <=====||*/
const io = new Server(httpServer)

let products = await productModel.find().lean()
let petitionStatus = ['success', 'failed']

io.on('connection', socket => {
    console.log('A user has been connected to the server')

    /*||=====> Listenings and emits for realTimeProducts <=====||*/
    io.emit('productsList', products)

    socket.on('productToDelete', async () => {
        try {
            let products = await productModel.find().lean()
            io.emit('productDeleted', products)
        } catch (error) {
            io.emit('petition', petitionStatus[1])
        }
    })
    socket.on('productAdded', async () => {
        try {
            let products = await productModel.find().lean()
            io.emit('newProductAdded', products)
        } catch (error) {
            io.emit('petition', petitionStatus[1])
        }
    })

    /*||=====> Listenings and emits for Chat <=====||*/

    socket.on('authenticated', async userEmail => {
        io.emit('newUserConnected', userEmail)
        let mongoDbMessages = await chatModel.find().lean()
        io.emit('updateMessages', mongoDbMessages)
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

export default app

