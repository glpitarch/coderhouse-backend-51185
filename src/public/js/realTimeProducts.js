const socket = io()

const deleteProductButton = document.getElementById('deleteButton');
const addProductButton = document.getElementById('addButton');

const productsRenderer = (_id, title, category, description, price, stock, code, thumbnail, owner) => {
    document.getElementById('productContainer').innerHTML += `
    <div id="productCardId${_id}" class="productCard p-3">
        <img class="productImage" src=${thumbnail} alt="">
        <p class="minSpaceTitleField"><strong>Nombre: </strong><span id="titleProductId${_id}"></span></p>
        <p><strong>Categoria: </strong><span id="categoryProductId${_id}"></span></p>
        <p class="minSpaceDescriptionField"><strong>Descripción: </strong><span id="descriptionProductId${_id}"></span></p>
        <p><strong>Precio: </strong><span id="priceProductId${_id}"></span></p>
        <p><strong>Stock: </strong><span id="stockProductId${_id}"></span></p>
        <p><strong>Código: </strong><span id="codeProductId${_id}"></span></p>
        <p><strong>Owner: </strong><span id="owner${_id}"></span></p>
        <p><strong>id: </strong><span id="productId${_id}"></span></p>
    </div>
`
    document.getElementById(`titleProductId${_id}`).innerHTML = title
    document.getElementById(`categoryProductId${_id}`).innerHTML = category
    document.getElementById(`descriptionProductId${_id}`).innerHTML = description
    document.getElementById(`priceProductId${_id}`).innerHTML = price
    document.getElementById(`stockProductId${_id}`).innerHTML = stock
    document.getElementById(`codeProductId${_id}`).innerHTML = code
    document.getElementById(`owner${_id}`).innerHTML = owner
    document.getElementById(`productId${_id}`).innerHTML = _id
}
socket.on('productsList', products => {
    document.getElementById('productContainer').innerHTML = null
    for (const product of products) {
        let { _id, title, category, description, price, stock, code, thumbnail, owner } = product
        productsRenderer(_id, title, category, description, price, stock, code, thumbnail, owner)
    }
})

socket.on('newProductAdded', products => {
    document.getElementById('productContainer').innerHTML = null
    for (const product of products) {
        let { _id, title, category, description, price, stock, code, thumbnail, owner } = product
        productsRenderer(_id, title, category, description, price, stock, code, thumbnail, owner)
    }
})

socket.on('productDeleted', products => {
    document.getElementById('productContainer').innerHTML = null
    for (const product of products) {
        let { _id, title, category, description, price, stock, code, thumbnail, owner } = product
        productsRenderer(_id, title, category, description, price, stock, code, thumbnail, owner)
    }
})

deleteProductButton.addEventListener('click', () => {
    const productId = document.getElementById('deleteInput').value
    fetch(`/api/products/${productId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert(`
                El producto fue eliminado satisfactoriamente
            `)
            socket.emit('productToDelete')
        } else {
            throw new Error('La eliminación del producto falló')
        }
    })
    .catch(error => {
        if (error) {
            alert(`Ha ocurrido un error en la eliminación del producto. Por favor, revisa el campo ingresado o vuelva a intentarlo más tarde.`)
        }
    })
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
    fetch('/api/products/', {
        method: 'POST',
        body: JSON.stringify(product),
        headers: {
            'Content-Type': 'application/json'
        }
        })
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error('La creación del producto falló')
            }
        })
        .then(data => {
            if (data.payload) {
                alert(`
                    Tu producto fue creado satisfactoriamente:
                    ID: ${data.payload._id}
                `)
                socket.emit('productAdded')
            } else {
                throw new Error('La creación del producto falló')
            }
        })
        .catch(error => {
            if (error) {
                alert(`Ha ocurrido un error en la creación del producto. Por favor, revisa los valores de los campos ingresados o vuelva a intentarlo más tarde.`)
            }
        })
})

socket.on('petition', petitionStatus => {
    if (petitionStatus === 'success') {
        alert('Tu petición se realizó correctamente')
    } else {
        alert('Ha ocurrido un error. Por favor, revisa los valores de los campos ingresados o vuelva a intentarlo más tarde.')
    }
})





