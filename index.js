import ProductManager from "./manager/productManager.js";

const productManagerTesting = new ProductManager()

const datosParaPrueba = async () =>{

    let product = {
        title: 'manzana',
        description: 'fruta',
        price: 50,
        thumbnail: 'link',
        stock: 100,
        code: 'm001'
    }

    /*---> Producto a agregar <--- */
/*     let result = await productManagerTesting.addProduct(product.title, product.description, product.price, product.thumbnail, product.stock, product.code);
    console.log(result) */

    /* ---> Consultar todos los productos <--- */
/*     let products = await productManagerTesting.getProducts()
    console.log(products) */

    /* ---> Buscar producto por ID correcto <--- */
/*     let product1 = await productManagerTesting.getProductById(1)
    console.log(product1) */

    /* ---> Buscar producto por ID incorrecto <--- */
/*     let product2 = await productManagerTesting.getProductById(55)
    console.log(product2) */

    /* ---> Eliminar producto <--- */
/*     let productToRemove = await productManagerTesting.deleteProduct(1)
    console.log(productToRemove) */

    /* ---> Producto para modificar <--- */
/*     let productToUpdate = await productManagerTesting.updateProduct(1, 'description', 'fruta')
    console.log(productToUpdate) */

} 

datosParaPrueba()