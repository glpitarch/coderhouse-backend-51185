const form = document.getElementById("loginForm")

form.addEventListener('submit', e => {
    e.preventDefault()
    const data = new FormData(form)
    const obj = {}
    data.forEach((value, key) => obj[key] = value)
    fetch('/api/session/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {

            window.location.replace('/products')
        } else {
            throw new Error('login failed')
        }
    }).catch(error => {
        if (error) {
            alert('Error al intentar logearse')
        }
    })
})
