const checkoutButton = document.getElementById('checkoutButton')
const deleteProductButtons = document.querySelectorAll('[id^="deleteProductButton-"]')

const getUserEmail = document.getElementById('userEmail')
const userEmail = getUserEmail.getAttribute('data-user-email')

const getCartId = document.getElementById('cartId')
const cartId = getCartId.getAttribute('data-cart-id')

deleteProductButtons.forEach(button => {
  button.addEventListener('click', () => {
    const productId = button.getAttribute('data-product-id')
      fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (response.ok) {
          window.location.replace('/cart')
          } else {
            throw new Error(`DELETE method failed`)
          }
        })
        .catch(error => {
          alert('Error al intentar eliminar el producto seleccionado del carrito')
          console.log(error)
        })
    })
  })

checkoutButton.addEventListener('click', () => {
  fetch(`/api/carts/${cartId}/purchase`, {
    method: 'POST'
  })
    .then(response => {
      if (response.ok) {
          return response.json()
        } else {
          throw new Error('Failed purchase order process')
        }  
    })
    .then(data => {
      const ticketData = data.payload
      fetch('/api/carts/purchase/email/confirmation', {
        method: 'POST',
        body: JSON.stringify({
          code: ticketData.ticket.code, 
          userEmail: ticketData.ticket.purchaser,
          purchase_datetime: ticketData.ticket.purchase_datetime,
          amount: ticketData.ticket.amount,
          productsOutOfStock: ticketData.productsOutOfStock
        }),
        headers: {
            'Content-Type': 'application/json'
          }
      })
    .then(response => {
            if (response.ok) {
              window.location.replace('/successfully-user-request')
            } else {
              throw new Error('Failed to send email')
            }
          })
    .catch(error => {
      alert('Ha ocurrido un error, por favor vuelva a intentarlo más tarde.')
      console.log(error)
    })
  })
})
