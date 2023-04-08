import fs from 'fs';

export default class CartManager {

    constructor(){
        this.path = './files/cart.json'
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

}