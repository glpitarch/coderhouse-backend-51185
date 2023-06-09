const checkoutButton = document.getElementById('checkoutButton')
const deleteProductButton = document.getElementById('deleteProductButton')
const getUserEmail = document.getElementById('userEmail')

const userEmail = getUserEmail.getAttribute('data-user-email')
const productId = deleteProductButton.getAttribute('data-product-id')
const cartId = checkoutButton.getAttribute('data-cart-id')

deleteProductButton.addEventListener('click', () => {
      fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (response.ok) {
           window.location.replace('/cart')
          }
        })
        .catch(error => {
          console.log(error)
        })
    })

checkoutButton.addEventListener('click', () => {
  fetch(`/api/carts/${cartId}/purchase`, {
    method: 'POST'
  })
    .then(response => {
        if (response.ok) {
            console.log(userEmail)
            fetch('/api/carts/purchase/email/confirmation', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Email': userEmail 
                  }
            })
                .then(response => {
                    if (response.ok) {
                        window.location.replace('/cart')
                    }
                })        
                .catch(error => {
                    console.log(error)
                })
        }
    })
    .catch(error => {
      console.log(error)
    })
})