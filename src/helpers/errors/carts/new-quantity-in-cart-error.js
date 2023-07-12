export const newQuantityInCartErrorInfo = (pid, cid, newQuantity) => {
    return `
    The new quantity value for product ID: ${pid} in cart ID: ${cid} it must be greater than 0, but received: ${newQuantity.quantity}
    `
}