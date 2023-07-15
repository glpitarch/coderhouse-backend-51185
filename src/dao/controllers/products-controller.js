import { productsServices } from '../repositories/index.js'
import productModel from './../persistence/mongodb/models/products-model.js'
import { CustomError } from './../../helpers/errors/custom-error.js'
import { EError } from './../../helpers/errors/enums/EError.js'
import { createProductErrorInfo } from './../../helpers/errors/products/create-product-error.js'
import { productQueryErrorInfo } from './../../helpers/errors/products/product-query-error.js'
import { idErrorInfo } from './../../helpers/errors/general/invalid-id-error.js'
import { updateProductErrorInfo } from './../../helpers/errors/products/update-product-error.js'
import { nonexistentIdErrorInfo } from './../../helpers/errors/general/nonexistent-id-error.js'

export default class ProductsController {
    async createProduct (req, res, next) {
        try {
            let { category, title, description, price, stock, code, thumbnail, status } = req.body
            if (!status) {
                status = true
            }
            const regex = /^[0-9]*$/
            let isStockNumber = regex.test(stock)
            let isPriceNumber = regex.test(price)
            if( (!category || !title || !description || !price || !stock || !code) || (stock < 0 || price < 0 || !isStockNumber || !isPriceNumber) ){
                CustomError.createError({
                    name: "Create product error",
                    message: "An error occurred while processing your create product request",
                    cause: createProductErrorInfo(req.body),
                    errorCode: EError.INVALID_JSON,
                })
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
            const productAdded = await productsServices.createProduct(newProduct)
            res.json({
                status: "success",
                result: productAdded,
                message: "product added"
            })
        } catch (error) {
            next(error)
        }
    }
    
    async getProducts (req, res, next) {
        try {
            const regex = /^[0-9]*$/;
            let query = JSON.parse(req.query.query)
            let limit = parseInt(query.limit)
            let sort = query.sort
            let page = query.page
            if (!page){
                page = 1
            }
            if (!limit){
                limit = 10
            }
            let isPageNumber = regex.test(page)
            let isLimitNumber = regex.test(limit)
            if(page < 0 || isPageNumber == false || page.length > 3 || limit < 0 || (limit && isLimitNumber == false) || (sort && (sort != 'asc' && sort != 'desc'))) {
                CustomError.createError({
                    name: "Invalid query",
                    message: "An error occurred trying to get HTTP query",
                    cause: productQueryErrorInfo(query),
                    errorCode: EError.INVALID_QUERY,
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
            
            await productModel.paginate( queryFilter, { 
                limit: limitOption, 
                page: page, 
                sort: sortOption, 
                lean: true 
            }, 
                function (err, result) {
                    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages } = result
        
                    let products = docs
        
                    let prevLinkValue = ''
                    if (hasPrevPage == false) {
                        prevLinkValue = null
                    } else {
                        page = parseInt(page)
                        prevLinkValue = `http://localhost:8080/api/products?page=${ page - 1 }${ limitUrl }${ sortUrl }${ queryUrl }`
                    }
        
                    let nextLinkValue = ''
                    if (hasNextPage == false) {
                        nextLinkValue = null
                    } else {
                        page = parseInt(page)
                        nextLinkValue = `http://localhost:8080/api/products?page=${ page + 1 }${ limitUrl }${ sortUrl }${ queryUrl }`
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
            next(error)
        }
    }

    async getProductById (req, res, next) {
        try {
            const id = req.params.id
            if (id.length != 24) {
                CustomError.createError({
                    name: "Invalid ID param",
                    message: "An error occurred trying to get HTTP ID parameter",
                    cause: idErrorInfo(id),
                    errorCode: EError.INVALID_PARAM,
                })
            }
            const product = await productsServices.getProductById(id)
            if (product === null) {
                CustomError.createError({
                    name: "GET product error",
                    message: "An error occurred while processing your GET product request",
                    cause: nonexistentIdErrorInfo(id),
                    errorCode: EError.DATABASE_ERROR,
                })
            }
            res.status(200).json({
                status: "success",
                result: product
            })
        } catch (error) {
            next(error)
        }
    }

    async updateProduct (req, res, next) {
        try {
            const id = req.params.id
            if (id.length != 24) {
                CustomError.createError({
                    name: "Invalid ID param",
                    message: "An error occurred trying to get HTTP ID parameter",
                    cause: idErrorInfo(id),
                    errorCode: EError.INVALID_PARAM,
                })
            }
            const valuesToUpdate = req.body
            const productUpdated = await productsServices.updateProduct(id, valuesToUpdate)
            if (productUpdated === null || valuesToUpdate.stock < 0 || valuesToUpdate.price < 0 || (valuesToUpdate.status != true && valuesToUpdate.status != false)) {
                CustomError.createError({
                    name: "Update product error",
                    message: "An error occurred while processing your update product request",
                    cause: updateProductErrorInfo(req.body),
                    errorCode: EError.INVALID_JSON,
                })
            }
            res.json({
                status:"success",
                result: productUpdated,
                message: "product successfully updated"})
        } catch (error) {
            next(error)
        }
    }

    async deleteProduct (req, res, next) {
        try {
            const id = req.params.id
            if (id.length != 24) {
                CustomError.createError({
                    name: "Invalid ID param",
                    message: "An error occurred trying to get HTTP ID parameter",
                    cause: idErrorInfo(id),
                    errorCode: EError.INVALID_PARAM,
                })
            }
            const productDeleted = await productsServices.deleteProduct(id)
            if (productDeleted === null) {
                CustomError.createError({
                    name: "Delete product error",
                    message: "An error occurred while processing your delete product request",
                    cause: nonexistentIdErrorInfo(id),
                    errorCode: EError.DATABASE_ERROR,
                })
            }
            res.json({
                status:"success",
                result: productDeleted
            })
        } catch (error) {
            next(error)
        }
    }
}