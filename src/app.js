import express from 'express'
import mongoose from 'mongoose';
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'
import productsRouter from './routes/products-router-fs.js'
import cartsRouter from './routes/carts-router-fs.js'
import viewsRouter from './routes/views-router.js'
import __dirname from './utils.js'
import productManager from './dao/file-system/managers/productManager.js'

const PORT = 8080;
const MONGO = 'mongodb+srv://admin:admin123@cluster0.m8kzlrt.mongodb.net/?retryWrites=true&w=majority'

const app = express()
const conection = mongoose.connect(MONGO);

const httpServer = app.listen(PORT, ()=>{
    console.log(`
        The server is online on port: ${ PORT }
    `)
})

const io = new Server(httpServer)
let products = await productManager.getProducts()

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
})

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


