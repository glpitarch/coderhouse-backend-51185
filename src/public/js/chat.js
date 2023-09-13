const socket = io()

const chatbox = document.getElementById('chatbox')
const sendMessageButton = document.getElementById('sendMessageButton')

let user = {
    user: '',
    message: '',
    timestamp: ''
}

const validatorUserButton = document.getElementById('userConfirmationButton')

    validatorUserButton.addEventListener('click', userEmail => {
    userEmail = document.getElementById('userEmailInput').textContent
    if (userEmail != '') {
        const logInContainer = document.getElementById('logInContainer')
        logInContainer.classList.add('hidden')
        const chatContainer = document.getElementById('chatContainer')
        chatContainer.classList.remove('hidden')
        user.user = userEmail
        socket.emit('authenticated', userEmail)
    } else {
        alert('Primero debe autenticarse para ingresar al chat público')
    }
})

socket.on('newUserConnected', userEmail => {
    alert(`Se ha unido al chat ${userEmail}`)
})

socket.on('updateMessages', mongoDbMessages => {
    let log = document.getElementById('messagesLogs')
    let message = document.getElementById('chatbox')
    message.value = ""

    let messages = ""
    mongoDbMessages.forEach(message => {
        messages +=  `
            <span class="mt-1"><strong>${ message.user }</strong> dice: ${ message.message }</span>
            </br>
            <span class="font-italic">${ message.timestamp }</span><br/><br/>
        `       
    })
    log.innerHTML = messages
})

sendMessageButton.addEventListener('click', message => {
    const date = new Date().toLocaleDateString()
    const time = new Date().toLocaleTimeString()
    message = document.getElementById('chatbox').value.trim()
    if (message === '') {
        return alert('El mensaje no debe estar vacio.')
    }
    user.message = message
    user.timestamp = `Fecha: ${ date } - Hora: ${ time }`
    socket.emit('userMessage', user)
    user.message = ''
})
