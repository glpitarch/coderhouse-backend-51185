import { Router } from 'express';
import productManager from "../dao/file-system/managers/productManager.js";

const router = Router();

router.get('/', async (req,res) => {
    let productsShowLimit = req.query.limit
    const products = await productManager.getProducts()
    if (productsShowLimit) {
        if (productsShowLimit > products.length) {
            return res.status(400).send(`
                The limit value exceeds the number of products available!
            `)
        } else {
            let arrayToShow = []
            for (let i = 0; i < productsShowLimit; i++) {
                let randomValue = Math.floor(Math.random() * (products.length));
                const productToAdd = products[randomValue];
                arrayToShow.push(productToAdd)
                const productIndex = products.findIndex((product)=> product.id == productToAdd.id)
                products.splice(productIndex,1)
            }
            return res.send(arrayToShow)
        }
    } return res.send(products)
})

router.post('/', async (req,res) => {
    let newProduct = req.body
    let keys = Object.keys(newProduct)
    let values = Object.values(newProduct)
    let { category, title, description, price, stock, code } = newProduct
    let thumbnail = []
    let status = true
    for (let i = 0; i < values.length; i++) {
        let value = values[i]
        let key = keys[i]
        if (key == 'thumbnail' && value) {
            thumbnail = value
        } else if (key == 'status' && value === false) {
            status = false
        }
    }
    let product = await productManager.addProduct(category, title, description, price, stock, code, thumbnail, status)
    res.send(product)
})

router.get('/:id', async (req,res) => {
    const id = req.params.id
    let product = await productManager.getProductById(id)
    res.send(product)
})

router.put('/:id', async (req,res) => {
    const id = req.params.id
    let valuesToUpdate = req.body
    let product = await productManager.updateProduct(id, valuesToUpdate)
    res.send(product)
})

router.delete('/:id', async (req,res) => {
    const id = req.params.id
    let product = await productManager.deleteProduct(id)
    res.send(product)
})

export default router;
