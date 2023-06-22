import { ProductsServicesMongo } from './../services/products-services-mongodb.js'
import productModel from './../persistence/mongodb/models/products-model.js'

const productServicesMongo = new ProductsServicesMongo()

export default class ProductController {
    async addProduct (req,res) {
        try {
            let { category, title, description, price, stock, code, thumbnail, status } = req.body
            if (!status) {
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
            const productAdded = await productServicesMongo.addProduct(newProduct)
            res.json({
                status: "success",
                result: productAdded,
                message: "product added"
            })
        } catch (error) {
            res.status(400).json({
                status: "error",
                message: error.message
            })
        }
    }
    
    async getProducts (req,res) {
        try {
            const regex = /^[0-9]*$/;
            let query = JSON.parse(req.query.query)
            let limit = parseInt(req.query.limit)
            let sort = req.query.sort
            let { page = 1 } = req.query
        
            let isNumber = regex.test(page)
            if(page < 0 || isNumber == false || page.length > 3) {
                res.status(400).json({
                    status: 'error',
                    message: 'Incorrect page value'
                })
            }
        
            let queryUrl  = ''
            let queryFilter = {}
            if (query) {
                queryFilter = query
            }
        
            let limitUrl = ''
            let limitOption = 10
            if (limit) {
                limitOption = limit
                limitUrl = `&limit=${ limit }`
            }
        
            let sortUrl = ''
            let sortOption = {}
            if (sort == 'asc') {
                sortOption = { price: 1 }
                sortUrl = `&sort=${ sort }`
            } else if (sort == 'desc') {
                sortOption = { price: -1 }
                sortUrl = `&sort=${ sort }`
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
                        prevLinkValue = `http://localhost:8080/products?page=${ page - 1 }${ limitUrl }${ sortUrl }${ queryUrl }`
                    }
        
                    let nextLinkValue = ''
                    if (hasNextPage == false) {
                        nextLinkValue = null
                    } else {
                        page = parseInt(page)
                        nextLinkValue = `http://localhost:8080/products?page=${ page + 1 }${ limitUrl }${ sortUrl }${ queryUrl }`
                    }
                    
                    if (err) {
                        const resultInfo = {
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
                        res.status(400).json({
                            status: "error",
                            result: resultInfo
                        })
                    } else {
                        const resultInfo = {
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
                        res.status(200).json({
                            status: "success",
                            result: resultInfo
                        })
                    }
            })
        } catch (error) {
            res.status(400).json({
                status: "error", 
                message: error.message
            })
        }
    }

    async getProductById (req,res) {
        try {
            const id = req.params.id
            const product = await productServicesMongo.getProductById(id)
            res.status(200).json({
                status: "success",
                result: product
            })
        } catch (error) {
            res.status(400).json({
                status: "error",
                message: error.message
            })
        }
    }

    async updateProduct (req,res) {
        try {
            const id = req.params.id
            const valuesToUpdate = req.body
            const productUpdated = await productServicesMongo.updateProduct(id, valuesToUpdate)
            res.json({
                status:"success",
                result: productUpdated,
                message: "product successfully updated"})
        } catch (error) {
            res.status(400).json({
                status: "error",
                message: error
            })
        }
    }

    async deleteProduct (req,res) {
        try {
            const id = req.params.id
            const productDeleted = await productServicesMongo.deleteProduct(id)
            res.json({
                status:"success",
                result: productDeleted
            })
        } catch (error) {
            res.status(400).json({
                status: "error",
                message: error.message
            })
        }
    }
}