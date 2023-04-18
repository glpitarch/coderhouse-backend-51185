const socket = io();

const deleteProductButton = document.getElementById('deleteButton');
const addProductButton = document.getElementById('addButton');

socket.on('productsList', products => {
    document.getElementById('productContainer').innerHTML = null
    for (const product of products) {
        let { id, title, category, description, price, stock, code } = product
        document.getElementById('productContainer').innerHTML += `
            <div id="productCardId${id}" class="pad-3">
                <p><strong>Nombre: </strong><span id="titleProductId${id}"></span></p>
                <p><strong>Categoria: </strong><span id="categoryProductId${id}"></span></p>
                <p><strong>Descripción: </strong><span id="descriptionProductId${id}"></span></p>
                <p><strong>Precio: </strong><span id="priceProductId${id}"></span></p>
                <p><strong>Stock: </strong><span id="stockProductId${id}"></span></p>
                <p><strong>Código: </strong><span id="codeProductId${id}"></span></p>
                <p><strong>id: </strong><span id="productId${id}"></span></p>
            </div>
        `
        document.getElementById(`titleProductId${id}`).innerHTML = title
        document.getElementById(`categoryProductId${id}`).innerHTML = category
        document.getElementById(`descriptionProductId${id}`).innerHTML = description
        document.getElementById(`priceProductId${id}`).innerHTML = price
        document.getElementById(`stockProductId${id}`).innerHTML = stock
        document.getElementById(`codeProductId${id}`).innerHTML = code
        document.getElementById(`productId${id}`).innerHTML = id
    }
})

deleteProductButton.addEventListener('click', productId => {
        productId = document.getElementById('deleteInput').value
        socket.emit('productToDelete', productId)
})

addProductButton.addEventListener('click', product => {
    product = {
        category: document.getElementById('categoryInput').value,
        title: document.getElementById('titleInput').value,
        description: document.getElementById('descriptionInput').value,
        price: document.getElementById('priceInput').value,
        stock: document.getElementById('stockInput').value,
        code: document.getElementById('codeInput').value,
        thumbnail: document.getElementById('thumbnailInput').value,
        status: document.getElementById('statusInput').value
    }
    socket.emit('productToAdd', product)
})



