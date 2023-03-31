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
    const productsShowLimit = req.query.limit
    const products = await productManager.getProducts()
    if (productsShowLimit) {
        let arrayToShow = []
        for (let i = 0; i < productsShowLimit; i++) {
            let randomValue = Math.floor(Math.random() * (products.length));
            const productToAdd = products[randomValue];
            arrayToShow.push(productToAdd)
            const productIndex = products.findIndex((product)=> product.id == productToAdd.id)
            products.splice(productIndex,1)
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