import fs from 'fs';
import __dirname from './../../../../absolute-path.js'
import path from 'path'
import { v4 as uuidv4 } from "uuid"

export class ProductsManagerFileSystem {

    constructor(){
        this.path = path.join(__dirname, './dao/persistence/file-system/files/products.json')
    }

    async getProducts () {
        try {
            if (fs.existsSync(this.path)){
                const data = await fs.promises.readFile(this.path, 'utf-8')
                const products = JSON.parse(data)
                return products
            } else {
              return []  
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async createProduct (newProduct) {
        try {
            let data = await this.getProducts()
            let randomId = uuidv4(24)
            randomId = (randomId.replace(/-/g, '')).substring(0, 24)
            newProduct._id = randomId
            if (await data.find(product => product.code == newProduct.code)) {
                return 'That code already exist!'
            }
                await data.push(newProduct)
                await fs.promises.writeFile(this.path, JSON.stringify(data, null, '\t'))
                return newProduct 
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getProductById (id) {
        try {
            let data = await this.getProducts();
            let product = data.find(product => product._id == id)
            if (product) {
                return product
            } else {
                return 'The product was not found'
            }  
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async updateProduct (id, valuesToUpdate) {
        try {
            let data = await this.getProducts()
            let selectedProduct = await this.getProductById(id)
            if (selectedProduct === 'The product was not found') {
                return 'Product does not exist'
            }
            let newKeys = Object.keys(valuesToUpdate)
            let newValues = Object.values(valuesToUpdate)
            for (const newKey of newKeys) {
                const index = newKeys.findIndex(Key => Key == newKey);
                if (newKey != '_id') {
                    selectedProduct[newKey] = newValues[index]
                } else {
                    return 'Product ID cannot be modified'
                }
            }
            let productIndexToUpdate = data.findIndex(product => product._id == id);
            data.splice(productIndexToUpdate, 1, selectedProduct)
            await fs.promises.writeFile(this.path, JSON.stringify(data, null, '\t'))
            return 'The product was successfully modified'
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async deleteProduct (id) {
        try {
            let products = await this.getProducts()
            const productIndex = products.findIndex((product)=> product._id == id)
            products.splice(productIndex, 1)
                try {
                    await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
                    return 'The product was successfully removed'
                } catch (error) {
                        return error   
                }
        } catch (error) {
            throw new Error(error.message)  
        }
    }
}
