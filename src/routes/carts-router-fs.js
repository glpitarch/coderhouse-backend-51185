import { Router } from 'express';
import cartManager from '../dao/file-system/managers/cartManager.js';
import productManager from '../dao/file-system/managers/productManager.js';

const router = Router();

router.post('/', async (req,res) => {
    let cartsData = await cartManager.createCartFile()
    let newCart = await cartManager.addCart(cartsData)
    res.send(`
        New cart created successfully!
        Cart ID: ${newCart.id}
    `)
})

router.get('/:cid', async (req,res) => {
    const cartId = req.params.cid
    let cart = await cartManager.getCartById(cartId)
    res.send(cart)
    }
)

router.post('/:cid/product/:pid', async (req,res) => {
    const cartId = req.params.cid
    let cartToUpdate = await cartManager.getCartById(cartId)
    if (cartToUpdate === 'The cart was not found') {
        return res.status(500).send(`
            Cart does not exist
        `)
    }
    const productId = req.params.pid
    let productToAdd = await productManager.getProductById(productId)
    if (productToAdd === 'The product was not found') {
        return res.status(500).send(`
            Product does not exist
        `)
    }
    let { id } = productToAdd
    let doesTheProductExist = cartToUpdate.products.find(product => product.id == id)
    if (doesTheProductExist != undefined){
        let { quantity } = doesTheProductExist
        quantity = ++quantity
        let product = {
            id: id,
            quantity: quantity
        }
        let productIndexToUpdate = cartToUpdate.products.findIndex(product => product.id == id);
        cartToUpdate.products.splice(productIndexToUpdate,1,product)
        cartManager.updateCartFileById(cartId, cartToUpdate)
        res.send(cartToUpdate)
    } else {
        let product = {
            id: id,
            quantity: 1
        }
        cartToUpdate.products.push(product)
        cartManager.updateCartFileById(cartId, cartToUpdate)
        res.send(cartToUpdate)
    }
})

export default router;