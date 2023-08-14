const checkoutButton = document.getElementById('checkoutButton')
const deleteProductButton = document.getElementById('deleteProductButton')
const getUserEmail = document.getElementById('userEmail')
const userEmail = getUserEmail.getAttribute('data-user-email')
const productId = deleteProductButton.getAttribute('data-product-id')
const cartId = checkoutButton.getAttribute('data-cart-id')

deleteProductButton.addEventListener('click', () => {
      fetch(`/api/carts/${cartId}/product/${productId}`, {
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
            fetch('/api/carts/purchase/email/confirmation', {
                method: 'POST',
                body: JSON.stringify({ email: userEmail}),
                headers: {
                    'Content-Type': 'application/json'
                  }
            })
                .then(response => {
                    if (response.ok) {
                      window.location.replace('/successfully-user-request')
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