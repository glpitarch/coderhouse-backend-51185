import fs from 'fs';

export default class ProductManager {

    constructor(){
        this.path = './files/products.json'
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

    addProduct = async (title, description, price, thumbnail, stock, code) => {

        let data = await this.getProducts();
        let productId = await data.length

        let product = {
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            stock: stock,
            code: code,
            id: ++productId
        }

        let values = Object.values(product)
        let counter = 0
        for (let i = 0; i < values.length; i++) {
            let value = values[i]
            if (!value) {
                counter += 1
                return console.error("All inputs fields are needed!")
            } 
        }
        
        if (await data.find(product => product.code == values[5])) {
            return console.error('That code already exist!')
        }

        else if (counter == 0) {
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
            console.error('The product was not found')
        }
    }

    updateProduct = async (id, field, newValue) => {
        let data = await this.getProducts()
        let productToUpdate = await this.getProductById(id)
        if (field != 'id'){
            productToUpdate[field] = newValue
            let filteredData = data.filter(product => product.id != id)
            let newData = filteredData
            newData.push(productToUpdate)  
            await fs.promises.writeFile(this.path, JSON.stringify(newData, null, '\t'))
            return console.log('The product was successfully modified')
        } else {
            return console.log('Product ID cannot be modified')
        }
    }

    deleteProduct = async (id) => {
        let products = await this.getProducts()
            const productIndex = products.findIndex((product)=> product.id == id)
            products.splice(productIndex,1)
    
            try {
                await fs.promises.writeFile(this.path, JSON.stringify(products,null,'\t'))
                return 'The product was successfully removed'
            } catch (error) {
                 return error   
            }
        }
    }



