export class ProductsServices {
    constructor(productsDao){
        this.productsDao = productsDao;
    }

    async createProduct(product){
        try {
            const newProduct = await this.productsDao.createProduct(product)
            return newProduct
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getProductById(id){
        try {
            const product = await this.productsDao.getProductById(id)
            return (product)
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async updateProduct(id, product){
        try {
            const productUpdated = await this.productsDao.updateProduct(id, product)
            return productUpdated
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async deleteProduct(id){
        try {
            await this.productsDao.deleteProduct(id)
            return { 
                message: "product successfully removed" 
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }
}