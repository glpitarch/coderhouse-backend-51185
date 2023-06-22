import productModel from './../persistence/mongodb/models/products-model.js'

class ProductsServicesMongo{

    async addProduct(product){
        try {
            const newProduct = await productModel.create(product)
            return newProduct
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getProductById(id){
        try {
            if (id.trim().length != 24) {
                throw new Error('Product ID is not valid')
            }
            const product = await productModel.findById(id)
            if(product){
                return product
            }
            throw new Error('The product was not found')
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async updateProduct(id, product){
        try {
            const productUpdated = await productModel.findByIdAndUpdate(id, product, {new:true})
            return productUpdated
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async deleteProduct(id){
        try {
            await productModel.findByIdAndDelete(id)
            return {message: "product successfully removed"}
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

export { ProductsServicesMongo }