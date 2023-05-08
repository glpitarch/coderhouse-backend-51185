import { Router } from 'express'
import cartModel from './../dao/mongodb/models/carts-model.js'
import mongoose from 'mongoose';
const router = Router();

router.post('/', async (req,res) => {
    let cart = {
        products: []
    }
    let newCart = await cartModel.create(cart)
    res.send(`
        New cart created successfully!
        Cart ID: ${newCart._id}
    `)
})

router.get('/', async (req,res) => {
    let carts = await cartModel.find()
    res.send(carts)
})

router.get('/:id', async (req,res) => {
    const id = req.params.id
    let cart = await cartModel.findById(id)
    res.send(cart)
})

router.post('/:cid/product/:pid', async (req,res) => {
    const cartId = req.params.cid
    const isValidCartId = mongoose.Types.ObjectId.isValid(cartId)
    if (!isValidCartId) {
        return res.status(500).send(`
            Cart does not exist
        `)
    }
    let cartToUpdate = await cartModel.findById(cartId)

    const productId = req.params.pid
    const isValidProductId = mongoose.Types.ObjectId.isValid(productId)
    if (!isValidProductId) {
        return res.status(500).send(`
            Product does not exist
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
        let result = await cartModel.findOneAndUpdate({ _id: cartId }, { $push: { 'products': product }})
        res.send({ result })
    }
})

export default router;