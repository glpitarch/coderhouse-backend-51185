export const updateProductErrorInfo = (product) =>{
    return `
    The product you are trying to access DO NOT exists or some of the products fields do not meet the required condition for its update.
    Expected to receive in the fields:
    category: must be a STRING, but received: ${product.category}
    title: must be a STRING, but received: ${product.title}
    description: must be a STRING, but received: ${product.description}
    price: must be a positive NUMBER, but received: ${product.price}
    stock: must be a positive NUMBER, but received: ${product.stock}
    code: must be a STRING, but received: ${product.code}
    thumbnail: must be a STRING, but received: ${product.thumbnail}    
    status: must be a BOOLEAN value, 'false' or 'true', but received: ${product.status}
    `
}