import fs from 'fs';

class CartManager {

    constructor(){
        this.path = './dao/file-system/files/cart.json'
    }

    createCartFile = async () => {
        if (fs.existsSync(this.path)){
            const data = await fs.promises.readFile(this.path, 'utf-8')
            const carts = JSON.parse(data)
            return carts;
        } else {
            let newFile = await fs.promises.writeFile(this.path, JSON.stringify([], null, '\t'))  
          return newFile
        }
    }

    getCarts = async () => {
        if (fs.existsSync(this.path)){
            const data = await fs.promises.readFile(this.path, 'utf-8')
            const carts = JSON.parse(data)
            return carts;
        } else {
          return 'The carts file was not found'  
        }
    }

    addCart = async (cartsData) => {
        let dataLength = await cartsData.length
        let productId = 0
        dataLength == 0 ? (productId = 0) : (productId = cartsData[dataLength-1].id)
        let cart = {
            id: ++productId,
            products: []
        }
        await cartsData.push(cart)
        await fs.promises.writeFile(this.path, JSON.stringify(cartsData, null, '\t'))
        return cart
    }

    getCartById = async (id) => {
        let data = await this.getCarts();
        let cart = data.find(cart => cart.id == id)
        if (cart) {
            return cart
        } else {
            return 'The cart was not found'
        }
    }

    updateCartFileById = async (cartIdToUpdate, cartUpdated) => {
        let cartsData = await cartManager.getCarts()
        let cartIndexToUpdate = cartsData.findIndex(cart => cart.id == cartIdToUpdate);
        cartsData.splice(cartIndexToUpdate, 1, cartUpdated)
        await fs.promises.writeFile(this.path, JSON.stringify(cartsData, null, '\t'))
        return cartsData
    }
}

const cartManager = new CartManager()

export default cartManager