import { Router } from 'express'
import productModel from './../dao/mongodb/models/products-model.js'

const router = Router()

router.get('/', async (req,res) => {
    let productsShowLimit = req.query.limit
    const products = await productModel.find()
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
    let { category, title, description, price, stock, code, thumbnail, status } = req.body
    if (!category || !title || !description || !price || !stock || !code){
        return res.status(400).send({ error: 'All inputs fields are needed!' })
    }
    else if (!status) {
        status = true
    } 

    let newProduct = {
        category,
        title,
        description,
        price,
        stock,
        code,
        thumbnail,
        status
    }

    let result = await productModel.create(newProduct)
    res.send(result)
})

router.get('/:id', async (req,res) => {
    const id = req.params.id
    let product = await productModel.findById(id)
    res.send(product)
})

router.put('/:id', async (req,res) => {
    const id = req.params.id
    let valuesToUpdate = req.body
    let product = await productModel.updateOne({ _id: id },{ $set: valuesToUpdate })
    res.send(product)
})

router.delete('/:id', async (req,res) => {
    const id = req.params.id
    let product = await productModel.deleteOne({ _id: id })
    res.send(product)
})

export default router;