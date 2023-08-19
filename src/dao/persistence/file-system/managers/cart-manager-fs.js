import fs from 'fs'
import __dirname from './../../../../absolute-path.js'
import path from 'path'
import { ProductsManagerFileSystem } from './product-manager-fs.js'

const productsManagerFileSystem = new ProductsManagerFileSystem()

export class CartsManagerFileSystem {

    constructor() {
        this.path = path.join(__dirname, './dao/persistence/file-system/files/cart.json')
    }

    async createCartFile() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8')
                const carts = JSON.parse(data)
                return carts
            } else {
                let newFile = await fs.promises.writeFile(this.path, JSON.stringify([], null, '\t'))  
              return newFile
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getCarts() {
        try {
            if (fs.existsSync(this.path)) {
                const data = this.createCartFile()
                return data
            } else {
              return 'The carts file was not found'  
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async createCart() {
        try {
            let cartsData = await this.createCartFile()
            let dataLength = await cartsData.length
            let productId = 0
            dataLength == 0 ? productId = 0 : productId = cartsData[dataLength-1].id
            let cart = {
                id: ++productId,
                products: []
            }
            await cartsData.push(cart)
            await fs.promises.writeFile(this.path, JSON.stringify(cartsData, null, '\t'))
            return cart  
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getCartById(id) {
        try {
            let data = await this.getCarts();
            let cart = data.find(cart => cart.id == id)
            if (cart) {
                return cart
            } else {
                return 'The cart was not found'
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async updateCartFileById(cartIdToUpdate, cartUpdated) {
        try {
            let cartsData = await this.getCarts()
            let cartIndexToUpdate = cartsData.findIndex(cart => cart.id == cartIdToUpdate);
            cartsData.splice(cartIndexToUpdate, 1, cartUpdated)
            await fs.promises.writeFile(this.path, JSON.stringify(cartsData, null, '\t'))
            return cartsData
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            let cartToUpdate = await this.getCartById(cartId)
            if (cartToUpdate === 'The cart was not found') {
                return (`
                    Cart does not exist
                `)
            }
            let productToAdd = await productsManagerFileSystem.getProductById(productId)
            if (productToAdd === 'The product was not found') {
                return (`
                    Product does not exist
                `)
            }
            let { id } = productToAdd
            let doesTheProductExist = cartToUpdate.products.find(product => product.id == id)
            if (doesTheProductExist != undefined){
                let { quantity } = doesTheProductExist
                quantity = ++quantity
                let product = {
                    id: id,
                    quantity: quantity
                }
                let productIndexToUpdate = cartToUpdate.products.findIndex(product => product.id == id);
                cartToUpdate.products.splice(productIndexToUpdate, 1, product)
                this.updateCartFileById(cartId, cartToUpdate)
                return cartToUpdate
            } else {
                let product = {
                    id: id,
                    quantity: 1
                }
                cartToUpdate.products.push(product)
                this.updateCartFileById(cartId, cartToUpdate)
                return cartToUpdate
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }
}
