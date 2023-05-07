import fs from 'fs';

class ProductManager {

    constructor(){
        this.path = './dao/file-system/files/products.json'
    }

    getProducts = async () => {
        if (fs.existsSync(this.path)){
            const data = await fs.promises.readFile(this.path, 'utf-8')
            const products = JSON.parse(data)
            return products;
        } else {
          return []  
        }
    }

    addProduct = async (category, title, description, price, stock, code, thumbnail, status) => {
        let data = await this.getProducts();
        let dataLength = await data.length
        let productId = 0
        dataLength == 0 ? (productId = 0) : (productId = data[dataLength-1].id)

        let product = {
            id: ++productId,
            category: category,
            title: title,
            description: description,
            price: price,
            stock: stock,
            code: code,
            thumbnail: thumbnail,
            status: status
        }

        let keys = Object.keys(product)
        let values = Object.values(product)
        let counter = 0
        for (let i = 0; i < values.length; i++) {
            let value = values[i]
            let key = keys[i]
            if (key == 'thumbnail' || key == 'status') {
                counter += 0
            } 
            if (key != 'thumbnail' && key != 'status'&& key != 'id' && !value) {
                counter += 1
                return 'All inputs fields are needed!'
            } 
        }
        if (await data.find(product => product.code == values[6])) {
            return 'That code already exist!'
        }
        if (counter == 0) {
            await data.push(product)
            await fs.promises.writeFile(this.path, JSON.stringify(data, null, '\t'))
            return product
        } 
    }

    getProductById = async (id) => {
        let data = await this.getProducts();
        let product = data.find(product => product.id == id)
        if (product) {
            return product
        } else {
            return 'The product was not found'
        }
    }

    updateProduct = async (id, valuesToUpdate) => {
        let data = await this.getProducts();
        let selectedProduct = await this.getProductById(id)
        if (selectedProduct === 'The product was not found') {
            return 'Product does not exist'
        }
        let newKeys = Object.keys(valuesToUpdate)
        let newValues = Object.values(valuesToUpdate)
        for (const newKey of newKeys) {
            const index = newKeys.findIndex(Key => Key == newKey);
            if (newKey != 'id') {
                selectedProduct[newKey] = newValues[index]
            } else {
                return 'Product ID cannot be modified'
            }
        }
        let productIndexToUpdate = data.findIndex(product => product.id == id);
        data.splice(productIndexToUpdate,1,selectedProduct)
        await fs.promises.writeFile(this.path, JSON.stringify(data, null, '\t'))
        return 'The product was successfully modified'
    }

    deleteProduct = async (id) => {
        let products = await this.getProducts()
        const productIndex = products.findIndex((product)=> product.id == id)
        if (productIndex == -1) {
            return 'Product does not exist'
        }
        products.splice(productIndex, 1)
            try {
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
                return 'The product was successfully removed'
            } catch (error) {
                    return error   
            }
        }
    }

const productManager = new ProductManager()

export default productManager

