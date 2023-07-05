class CartsServices {
    constructor(cartsDao){
        this.cartsDao = cartsDao
    }

    async getCarts(){
        try {
            const carts = await this.cartsDao.getCarts()
            return carts
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async createCart(){
        try {
            const newCart = await this.cartsDao.createCart()
            return newCart
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getCartById(id){
        try {
            const cart = await this.cartsDao.getCartById(id)
            return cart
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async addProductToCart(cartId,productId){
        try {
            const result = await this.cartsDao.addProductToCart(cartId, productId)
            return result
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateProductQuantityInCart(cartId, productId, newQuantity){
        try {
            const result = await this.cartsDao.updateProductQuantityInCart(cartId, productId, newQuantity)
                return result
        } catch (error) {
            throw new Error(error.message)
        }
    } 

    async updateFullCart(cartId, productsList){
        try {
            const result = await this.cartsDao.updateFullCart(cartId, productsList)
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async deleteProductInCart(cartId, productId){
        try {
            const result = await this.cartsDao.deleteProductInCart(cartId, productId)
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async deleteEveryProductInCart(cartId){
        try {
            const result = await this.cartsDao.deleteEveryProductInCart(cartId)
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

export { CartsServices }