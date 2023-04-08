import { Router } from 'express';
import CartManager from '../managers/cartManager.js';
import fs from 'fs';
const cartManager = new CartManager()

const router = Router();

router.post('/', async (req,res)=> {
    let cartsData = await cartManager.createCartFile()
    let newCart = await cartManager.addCart(cartsData)
    res.send(`
    New cart created successfully!
    Cart ID: ${newCart.id}
    `)
})

router.get('/:cid', async (req,res)=>{
    let productIdInCart = req.query.cid
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

router.post('/:cid/product/:pid', async (req,res)=>{

})

export default router;