export const createProductErrorInfo = (product) =>{
    return `
    Some of the products form fields do not meet the required condition for its creation.
    Expected to receive in the fields:
    category: This input must be a STRING, but received: ${product.category}
    title: This input must be a STRING, but received: ${product.title}
    description: This input must be a STRING, but received: ${product.description}
    price: This input must be a positive NUMBER, but received: ${product.price}
    stock: This input must be a positive NUMBER, but received: ${product.stock}
    code: This input must be a STRING, but received: ${product.code}
    `
}