const updateRoleButtons = document.querySelectorAll('[id^="changeRoleButton-"]')
updateRoleButtons.forEach(button => {
  button.addEventListener('click', () => {
    const userId = button.getAttribute('data-user-id')
        fetch(`/api/users/premium/${userId}`, {
          method: 'PUT'
        })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'error') {
            document.getElementById(`documentation-info-${userId}`).innerHTML = 'Falta documentación. Actualización fallida.'
          } else {
            document.getElementById(`documentation-info-${userId}`).innerHTML = 'Actualización exitosa de rol.'
            setTimeout(() => {
                window.location.replace('/updateRole')
              }, 2500)
          }
        })
        .catch(error => {
            console.log(error)
            document.getElementById(`documentation-info-${userId}`).innerHTML = 'Error en la solicitud. Actualización fallida. Intente nuevamente más tarde.'
        })
      })
})

const deleteUserButton = document.querySelectorAll('[id^="deleteUserButton-"]')
deleteUserButton.forEach(button => {
  button.addEventListener('click', () => {
    const userId = button.getAttribute('data-user-id')
        fetch(`/api/users/${userId}`, {
          method: 'DELETE'
        })
        .then(response => {
          if (response.ok) {
            document.getElementById(`delete-user-info-${userId}`).innerHTML = 'El usuario fue eliminado exitosamente.'
            setTimeout(() => {
              window.location.replace('/updateRole')
            }, 2500)
          }
        })
        .catch(error => {
          document.getElementById(`delete-user-info-${userId}`).innerHTML = 'Error en la solicitud. Eliminación fallida. Intente nuevamente más tarde.'
          console.log(error.message)
          setTimeout(() => {
            window.location.replace('/updateRole')
          }, 4000)
        })
      })
})

const deleteUsersButton = document.getElementById('deleteUsersButton')
deleteUsersButton.addEventListener('click', () => {
        fetch(`/api/users/`, {
          method: 'DELETE'
        })
          .then(response => {
            if (response.ok) {
              alert('Todos los usuarios inactivos fueron eliminados correctamente.')
              setTimeout(() => {
                window.location.replace('/updateRole')
              }, 1500)
            }
          })
          .catch(error => {
            console.log(error.message)
            setTimeout(() => {
              window.location.replace('/updateRole')
            }, 1500)
          })
})