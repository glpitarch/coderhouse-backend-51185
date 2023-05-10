const socket = io();

const chatbox = document.getElementById('chatbox');
const sendMessageButton = document.getElementById('sendMessageButton');

let user = {
    user: '',
    message: ''
}

const validatorUserButton = document.getElementById('userConfirmationButton');
    validatorUserButton.addEventListener('click', userEmail => {
    userEmail = document.getElementById('userEmailInput').value.trim()
    let isAnEmail = userEmail.includes('@')
    if (userEmail != '' && isAnEmail == true) {
        const logInContainer = document.getElementById('logInContainer')
        logInContainer.classList.add('hiden')
        const chatContainer = document.getElementById('chatContainer')
        chatContainer.classList.remove('hiden')
        user.user = userEmail
        socket.emit('authenticated', userEmail)
    } else {
        alert('Debe ser una dirección de email valida!')
    }
})

socket.on('newUserConnected', userEmail => {
    alert(`se ha unido al chat ${userEmail}`)
})

socket.on('updateMessages', mongoDbMessages => {
    let log = document.getElementById('messagesLogs')
    let messages = ""
    mongoDbMessages.forEach(message => {
        messages +=  `<strong>${ message.user }</strong> dice: ${ message.message } <br/>  `       
    });
    log.innerHTML = messages
})

sendMessageButton.addEventListener('click', message => {
    message = document.getElementById('chatbox').value.trim()
    user.message = message
    socket.emit('userMessage', user)
    user.message = ''
})
