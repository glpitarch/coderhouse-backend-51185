export const premiumUserAddProductErrorInfo = (pid, owner, userEmail) => {
    return `
    You cannot add a product if you are the owner of it.
    Product ID: ${pid}
    Product owner: ${owner}
    User email: ${userEmail}
    `
}