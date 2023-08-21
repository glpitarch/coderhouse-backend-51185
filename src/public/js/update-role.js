const updateRoleButton = document.querySelectorAll('[id^="changeRoleButton-"]');
updateRoleButton.forEach(button => {
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
            document.getElementById(`documentation-info-${userId}`).innerHTML = 'Actualizacion exitosa de rol.'

            setTimeout(() => {
                window.location.replace('/updateRole')
              }, 4000)
          }
        })
        .catch(error => {
            console.log(error)
            document.getElementById(`documentation-info-${userId}`).innerHTML = 'Error en la solicitud. Actualización fallida. Intente nuevamente más tarde.'
        })
      })
  })

const deleteUserButton = document.querySelectorAll('[id^="deleteUserButton-"]');
deleteUserButton.forEach(button => {
  button.addEventListener('click', () => {
    const userId = button.getAttribute('data-user-id')
        fetch(`/api/users/${userId}`, {
          method: 'DELETE'
        })
        .then(response => {
          if (response.ok) {
            document.getElementById(`delete-user-info`).innerHTML = 'El usuario fue eliminado exitosamente.'

            setTimeout(() => {
              window.location.replace('/updateRole');
            }, 4000)
          }
        })
        .catch(error => {
          document.getElementById(`documentation-error`).innerHTML = 'Error en la solicitud. Eliminación fallida. Intente nuevamente más tarde.'
          console.log(error.message)

          setTimeout(() => {
            window.location.replace('/updateRole');
          }, 4000)
        })
      })
  })