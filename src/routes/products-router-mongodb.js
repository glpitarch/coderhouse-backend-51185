import { Router } from 'express'
import productModel from './../dao/mongodb/models/products-model.js'

const router = Router()

router.get('/', async (req,res) => {
    let query = req.query.query
    let limit = parseInt(req.query.limit)
    let sort = req.query.sort
    let { page = 1 } = req.query

    let queryFilter = {}
    if (query) {
        const regex = /^[0-9]*$/;
        let correctedQuery = query.trim()
        if (correctedQuery == 'Sahumerios' || correctedQuery == 'Defumacion' || correctedQuery == 'Conos y Cascadas' || correctedQuery == 'Sahumos'){
            queryFilter = { category: query }
        } else if (regex.test(correctedQuery)) {
            queryFilter = { stock: correctedQuery }
        }
    }

    let limitOption = 10
    if (limit) {
        limitOption = limit
    }

    let sortOption = {}
    if (sort == 'asc') {
        sortOption = { price: 1 }
    } else if (sort == 'desc') {
        sortOption = { price: -1 }
    }

    await productModel.paginate( 
        queryFilter, 
        { limit: limitOption, page: page, sort: sortOption, lean: true }, 
        function (err, result) {
            const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages } = result

            let products = docs

            let prevLinkValue = ''
            if (hasPrevPage == false) {
                prevLinkValue = null
            } else {
                page = parseInt(page)
                prevLinkValue = `http://localhost:8080/products?page=${ page - 1 }`
            }

            let nextLinkValue = ''
            if (hasNextPage == false) {
                nextLinkValue = null
            } else {
                page = parseInt(page)
                nextLinkValue = `http://localhost:8080/products?page=${ page + 1 }`
            }

            if (err) {
                let resultInfo = {
                    "status": "error",
                    "payload": products,
                    "totalPages": totalPages,
                    "prevPage": prevPage,
                    "nextPage": nextPage,
                    "page": page,
                    "hasPrevPage": hasPrevPage,
                    "hasNextPage": hasNextPage,
                    "prevLink": prevLinkValue,
                    "nextLink": nextLinkValue
                }
                return res.send({resultInfo})
            } else {
                let resultInfo = {
                    "status": "succes",
                    "payload": products,
                    "totalPages": totalPages,
                    "prevPage": prevPage,
                    "nextPage": nextPage,
                    "page": page,
                    "hasPrevPage": hasPrevPage,
                    "hasNextPage": hasNextPage,
                    "prevLink": prevLinkValue,
                    "nextLink": nextLinkValue
                }
                return res.send({resultInfo})
            }
    })
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