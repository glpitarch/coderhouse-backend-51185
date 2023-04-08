import { Router } from 'express';
import ProductManager from "../manager/productManager.js";
const productManager = new ProductManager()

const router = Router();

router.get('/', async (req,res)=>{
    let productsShowLimit = req.query.limit
    const products = await productManager.getProducts()
    if (productsShowLimit) {
        if (productsShowLimit > products.length) {
            console.log('El valor limite supera la cantidad de productos existentes')
            return res.send(products)
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
    } else {
        res.send(products)
    }
})

router.post('/', async (req,res)=>{
    let newProduct = req.body
    let keys = Object.keys(newProduct)
    let values = Object.values(newProduct)
    let { category, title, description, price, stock, code } = newProduct
    let thumbnail = []
    let status = true
    for (let i = 0; i < values.length; i++) {
        let value = values[i]
        let key = keys[i]
        if (key == 'category') {
            category = value
        }
        else if (key == 'title') {
            title = value
        }
        else if (key == 'description') {
            description = value
        }
        else if (key == 'price') {
            price = value
        }
        else if (key == 'stock') {
            stock = value
        }
        else if (key == 'code') {
            code = value
        }
        else if (key == 'thumbnail' && value) {
            thumbnail = value
        }
        else if (key == 'status' && value) {
            thumbnail = value
        }
    }
    let product = await productManager.addProduct(category, title, description, price, stock, code, thumbnail, status)
    res.send(product)
})

router.get('/:id', async (req,res)=>{
    const id = req.params.id
    let product = await productManager.getProductById(id)
    res.send(product)
})

router.put('/:id', async (req,res)=>{
    const id = req.params.id
    let valuesToUpdate = req.body
    let product = await productManager.updateProduct(id, valuesToUpdate)
    res.send(product)
})

router.delete('/:id', async (req,res)=>{
    const id = req.params.id
    let product = await productManager.deleteProduct(id)
    res.send(product)
})

export default router;