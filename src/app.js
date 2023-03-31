import express from 'express'
import ProductManager from "./manager/productManager.js";

const PORT = 8080;
const productManager = new ProductManager()
const app = express();

app.listen(PORT, ()=>{
    console.log(`Servidor funcionando en el puerto: ${ PORT }`)
})
app.use(express.urlencoded({extended:true}))

app.get('/', async (req,res)=>{   
    let prueba = await productManager.getProducts()
     res.send(console.log(prueba))
})

app.get('/products', async (req,res)=>{
    const productsToShow = req.query.limit
    const products = await productManager.getProducts()
    if (productsToShow) {
        let arrayToShow = []
        for (let i = 0; i < productsToShow; i++) {
            const maxNumber = products.length
            let randomValue = Math.floor(Math.random() * (maxNumber));
            const product = products[randomValue];
            arrayToShow.push(product)
        }
        return res.send(arrayToShow)
    } else {
        res.send(products)
    }
})

app.get('/products/:id', async (req,res)=>{
    const id = req.params.id
    let product = await productManager.getProductById(id)
    res.send(product)
})