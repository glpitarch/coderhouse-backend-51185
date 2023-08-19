import productModel from './../models/products-model.js'

export class ProductsManagerMongo {

    async createProduct(product) {
        try {
            const newProduct = await productModel.create(product)
            return newProduct
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getProductById(id) {
        try {
            const product = await productModel.findById(id)
                return product
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async updateProduct(id, product) {
        try {
            const productUpdated = await productModel.findByIdAndUpdate(id, product, {new:true})
            return productUpdated
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async deleteProduct(id) {
        try {
            const product = await productModel.findByIdAndDelete(id)
            return product
        } catch (error) {
            throw new Error(error.message)
        }
    }
}