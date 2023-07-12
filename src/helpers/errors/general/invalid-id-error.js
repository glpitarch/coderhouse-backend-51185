export const idErrorInfo = (id) => {
    return `
    The ID you are trying to access has the following error:
    ID: must be an 24 alphanumeric characters, but received: ${id}
    `
}