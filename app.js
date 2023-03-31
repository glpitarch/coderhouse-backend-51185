import express from 'express'
import ProductManager from "./src/manager/productManager.js";


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

app.get('/products', (req,res)=>{
    res.send('hola')
})

app.get('/products/:id', (req,res)=>{
    
    const reqProductId = req.params.id
    let prueba = productManagerTesting.getProductById(reqProductId)
    console.log(prueba)
    res.send(
        console.log(prueba)
    )
})