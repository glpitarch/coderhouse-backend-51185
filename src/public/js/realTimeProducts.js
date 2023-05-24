const socket = io();

const deleteProductButton = document.getElementById('deleteButton');
const addProductButton = document.getElementById('addButton');

socket.on('productsList', products => {
    document.getElementById('productContainer').innerHTML = null
    for (const product of products) {
        let { _id, title, category, description, price, stock, code, thumbnail } = product
        document.getElementById('productContainer').innerHTML += `
            <div id="productCardId${_id}" class="productCard p-3">
                <img class="productImage" src=${thumbnail} alt="">
                <p class="minSpaceTitleField"><strong>Nombre: </strong><span id="titleProductId${_id}"></span></p>
                <p><strong>Categoria: </strong><span id="categoryProductId${_id}"></span></p>
                <p class="minSpaceDescriptionField"><strong>Descripción: </strong><span id="descriptionProductId${_id}"></span></p>
                <p><strong>Precio: </strong><span id="priceProductId${_id}"></span></p>
                <p><strong>Stock: </strong><span id="stockProductId${_id}"></span></p>
                <p><strong>Código: </strong><span id="codeProductId${_id}"></span></p>
                <p><strong>id: </strong><span id="productId${_id}"></span></p>
            </div>
        `
        document.getElementById(`titleProductId${_id}`).innerHTML = title
        document.getElementById(`categoryProductId${_id}`).innerHTML = category
        document.getElementById(`descriptionProductId${_id}`).innerHTML = description
        document.getElementById(`priceProductId${_id}`).innerHTML = price
        document.getElementById(`stockProductId${_id}`).innerHTML = stock
        document.getElementById(`codeProductId${_id}`).innerHTML = code
        document.getElementById(`productId${_id}`).innerHTML = _id
    }
})

deleteProductButton.addEventListener('click', productId => {
        productId = document.getElementById('deleteInput').value
        socket.emit('productToDelete', productId)
})

addProductButton.addEventListener('click', product => {
    let stringStatus = document.getElementById('statusInput').value
    let toBooleanStatus = (stringStatus.toLowerCase() === 'true')
    product = {
        category: document.getElementById('categoryInput').value,
        title: document.getElementById('titleInput').value,
        description: document.getElementById('descriptionInput').value,
        price: document.getElementById('priceInput').value,
        stock: document.getElementById('stockInput').value,
        code: document.getElementById('codeInput').value,
        thumbnail: document.getElementById('thumbnailInput').value,
        status:  toBooleanStatus
    }
    socket.emit('productToAdd', product)
})



