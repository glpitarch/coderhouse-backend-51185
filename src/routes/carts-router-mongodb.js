import { Router } from 'express'
import cartModel from './../dao/mongodb/models/carts-model.js'
import mongoose from 'mongoose'

const router = Router();

router.post('/', async (req,res) => {
    let cart = {
        products: []
    }
    let newCart = await cartModel.create(cart)
    res.send(`
        New cart created successfully!
        Cart ID: ${ newCart._id }
    `)
})

router.get('/', async (req,res) => {
    let carts = await cartModel.find()
    res.send(carts)
})

router.get('/:cid', async (req,res) => {
    const cid = req.params.cid
    let cart = await cartModel.findById(cid).populate('products._id')
    res.send(cart)
})

router.post('/:cid/product/:pid', async (req,res) => {
    const cartId = req.params.cid
    const isValidCartId = mongoose.Types.ObjectId.isValid(cartId)
    if (!isValidCartId) {
        return res.status(500).send(`
            Cart does not exist
            Cart ID: ${ cartId }
        `)
    }
    let cartToUpdate = await cartModel.findById(cartId)

    const productId = req.params.pid
    const isValidProductId = mongoose.Types.ObjectId.isValid(productId)
    if (!isValidProductId) {
        return res.status(500).send(`
            Product does not exist
            Product ID: ${ productId }
        `)
    }
    let doesTheProductExist = cartToUpdate.products.findIndex(product => product._id == productId)
    if (doesTheProductExist != -1) {
        let qty = cartToUpdate.products[doesTheProductExist].quantity
        qty += 1
        let result = await cartModel.updateOne(
            { _id: cartId, 'products._id': productId },
            { $set:{ 'products.$.quantity': qty }}
        )
        res.send({ result })
    } else {
        let product = {
            _id: productId,
            quantity: 1
        }
        let result = await cartModel.updateOne({ _id: cartId }, { $push: { 'products': product }})
        res.send({ result })
    }
})

router.put('/:cid/product/:pid', async (req,res) => {
    const cartId = req.params.cid
    const isValidCartId = mongoose.Types.ObjectId.isValid(cartId)
    if (!isValidCartId) {
        return res.status(400).send(`
            Cart does not exist
            Cart ID: ${ cartId }
        `)
    }
    let cartToUpdate = await cartModel.findById(cartId)

    const productId = req.params.pid
    const isValidProductId = mongoose.Types.ObjectId.isValid(productId)
    if (!isValidProductId) {
        return res.status(400).send(`
            Product does not exist
            Product ID: ${ productId }
        `)
    }
    
    let newQuantity = req.body
    let isNumber = typeof newQuantity.quantity == 'number'
    let isGreaterThan = newQuantity.quantity > 0
    if(isNumber != true || isGreaterThan != true) {
        return res.status(400).send(`
            ${ newQuantity } is not a correct value!
            Value must be a number greater than 0
        `)
    }

    let doesTheProductExist = cartToUpdate.products.findIndex(product => product._id == productId)
    if (doesTheProductExist != -1) {
        let result = await cartModel.updateOne(
            { _id: cartId, 'products._id': productId },
            { $set:{ 'products.$.quantity': newQuantity.quantity }}
        )
        res.send({ result })
    } else {
        return res.status(400).send(`
            Product does not exist in cart:
            Cart ID: ${ cartId }
            Product ID: ${ productId }
        `)
    }
})

router.put('/:cid', async (req,res) => {

    const cartId = req.params.cid

    const isValidCartId = mongoose.Types.ObjectId.isValid(cartId)
    if (!isValidCartId) {
        return res.status(400).send(`
            Cart does not exist
            Cart ID: ${ cartId }
        `)
    }

    let cartToUpdate = await cartModel.findById(cartId)

    let productsList = req.body

    const isValidId = (productId) => {
        let isValid = mongoose.Types.ObjectId.isValid(productId)
        return isValid
    }
    for (const product of productsList) {

        let isValid = isValidId(product._id)
        if (!isValid) {
            return res.status(400).send(`
                Product does not exist:
                Product ID: ${ product._id }
            `)
        }

        let doesTheProductExist = cartToUpdate.products.findIndex(item => item._id == product._id)

        if (doesTheProductExist != -1) {
            cartToUpdate.products[doesTheProductExist].quantity = cartToUpdate.products[doesTheProductExist].quantity + product.quantity
        } else {
            cartToUpdate.products.push(product)
        }
    }

    let result = await cartModel.updateOne(
        { _id: cartId },
        { $set:{ 'products': cartToUpdate.products }}
    )
    res.send({ result })
})


/*     let doesTheProductExist = cartToUpdate.products.findIndex(product => product._id == productId)
    if (doesTheProductExist != -1) {
        let result = await cartModel.updateOne(
            { _id: cartId, 'products._id': productId },
            { $set:{ 'products.$.quantity': newQuantity.quantity }}
        )
        res.send({ result })
    } else {
        return res.status(400).send(`
            Product does not exist in cart:
            Cart ID: ${ cartId }
            Product ID: ${ productId }
        `)
    } */
/* }) */

router.delete('/:cid', async (req,res) => {
    const cartId = req.params.cid
    let cart = await cartModel.findById(cartId)
    const isValidCartId = mongoose.Types.ObjectId.isValid(cartId)
    if (!isValidCartId) {
        return res.status(500).send(`
            Cart does not exist
            Cart ID: ${ cartId }
        `)
    }
    cart.products.splice(0)
    let result = await cartModel.updateOne({ _id: cartId }, { $set: { 'products': cart.products }})
    res.send(result)
})

router.delete('/:cid/products/:pid', async (req,res) => {
    const cartId = req.params.cid
    let cart = await cartModel.findById(cartId)
    const isValidCartId = mongoose.Types.ObjectId.isValid(cartId)
    if (!isValidCartId) {
        return res.status(500).send(`
            Cart does not exist
            Cart ID: ${ cartId }
        `)
    }
    const productId = req.params.pid
    let doesTheProductExist = cart.products.findIndex(product => product._id == productId)
    if (doesTheProductExist == -1) {
        return res.status(500).send(`
            Product does not exist in cart:
            Cart ID: ${ cartId }
            Product ID: ${ productId }
        `)
    } else {
        cart.products.splice(doesTheProductExist, 1)
        let result = await cartModel.updateOne({ _id: cartId }, { $set: { 'products': cart.products }})
        res.send({ result })
    }
})

export default router;