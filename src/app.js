import express from 'express'
import handlebars from 'express-handlebars';
import productsRouter from './routes/products-router.js'
import cartsRouter from './routes/carts-router.js'
import viewsRouter from './routes/views.router.js'
import __dirname from './utils.js'

const PORT = 8080;

const app = express();

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.listen(PORT, ()=>{
    console.log(`
        The server is online on port: ${ PORT }
    `)
})

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
