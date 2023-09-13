const form = document.getElementById('registerForm')

form.addEventListener('submit', e => {
    e.preventDefault()
    const data = new FormData(form)
    const obj = {}
    data.forEach((value, key) => obj[key] = value)
    fetch('/api/session/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            window.location.replace('/register-success')
        } else {
            throw new Error('Registration failed')
        }
    }).catch(error => {
        if (error) {
            window.location.replace('/register-failed')
        }
    })
})