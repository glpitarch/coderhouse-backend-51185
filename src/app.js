import express from 'express'
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import __dirname from './utils.js'
import productModel from './dao/mongodb/models/products-model.js'
import chatModel from './dao/mongodb/models/chat-model.js'
/* import productManager from './dao/file-system/managers/productManager.js' */
/*-----//_ Routes from MongoDB _//-----*/
import productsRouterMongo from './routes/products-router-mongodb.js'
import cartsRouterMongo from './routes/carts-router-mongodb.js'
import viewsRouterMongo from './routes/views-router-mongodb.js'
import chatRouterMongo from './routes/chat-router-mongodb.js'
import sessionRouter from './routes/sessions-router.js';
/*-----//_ Routes from fileSystem _//-----*/
/* import productsRouterFs from './routes/products-router-fs.js'
import cartsRouterFs from './routes/carts-router-fs.js'
import viewsRouterFs from './routes/views-router-fs.js' */

const DB = 'ecommerce'
const PORT = 8080;
const MONGO = `mongodb+srv://admin:admin123@cluster0.m8kzlrt.mongodb.net/${ DB }?retryWrites=true&w=majority`

const app = express()
const conection = mongoose.connect(MONGO);

const httpServer = app.listen(PORT, ()=>{
    console.log(`
        The server is online on port: ${ PORT }
    `)
})

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({
    store: new MongoStore({
        mongoUrl: MONGO,
        ttl: 3600
    }),
    secret: 'CoderSecret',
    resave: false,
    saveUninitialized: false
}))

/*-----//_ Routes for MongoDB _//-----*/
app.use('/', viewsRouterMongo);
app.use('/api/products', productsRouterMongo);
app.use('/api/carts', cartsRouterMongo);
app.use('/api/session', sessionRouter);
app.use('/chat', chatRouterMongo);

const io = new Server(httpServer)

let products = await productModel.find().lean()
let mongoDbMessages = await chatModel.find().lean()

io.on('connection', socket => {
    console.log('A user has been connected to the server');

    /*-----//_ Listenings and emits for realTimeProducts _//-----*/
    io.emit('productsList', products)

    socket.on('productToDelete', async productId => {
        await productModel.deleteOne({_id: productId})
        let products = await productModel.find().lean()
        io.emit('productsList', products)
    })
    socket.on('productToAdd', async product => {
        await productModel.create(product)
        let products = await productModel.find().lean()
        io.emit('productsList', products)
    })

    /*-----//_ Listenings and emits for Chat _//-----*/
    io.emit('updateMessages', mongoDbMessages)

    socket.on('authenticated', async userEmail => {
        io.emit('newUserConnected', userEmail)
    })

    socket.on('userMessage', async message => {
        await chatModel.create(message)
        let chatHistorial = await chatModel.find().lean()
        io.emit('updateMessages', chatHistorial)
    })
})

/*-----//_ fileSystem socket.io _//-----*/
/* let products = await productManager.getProducts()
io.on('connection', socket => {
    console.log('A user has been connected to the server');

    io.emit('productsList', products)

    socket.on('productToDelete', async productId => {
        await productManager.deleteProduct(productId)
    })

    socket.on('productToAdd', async product => {
        let { category, title, description, price, stock, code, thumbnail, status } = product
        await productManager.addProduct( category, title, description, price, stock, code, thumbnail, status )
    })
}) */

/*-----//_ Routes for fileSystem _//-----*/
/* app.use('/', viewsRouterFs);
app.use('/api/products', productsRouterFs);
app.use('/api/carts', cartsRouterFs); */


