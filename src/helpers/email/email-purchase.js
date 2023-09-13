export const purchaseEmailTemplate = (code, purchase_datetime, amount, productsOutOfStock) => {
    let outOfStock = ``
    if (productsOutOfStock.length === 0) {
        outOfStock = `
            <div>
                <p>Todos los productos que pediste se encuentran en stock.</p>
            </div>
        <br>
        <br>
        `
    } else {
        let productsNames = ``
        productsOutOfStock.forEach(product => {
            let productName = `<strong>Nombre</strong>: ${ product._id.title }<br>`
            productsNames += productName
        })
        outOfStock = `
            <div>
                <p>La cantidad solicitada de los siguientes productos no se encuentran en stock:</p>
                ${ productsNames }
                <p><strong>ACLARACION:</strong> El monto total de los productos de la lista previa no fue incluido en su ticket debido a la falta de stock.</p>
            </div>
        <br>
        <br>
        `
    }   
    return `
    <center>
        <div>
                <h2>Muchas Gracias por elegirnos</h2>
                <p>¡Tu pedido fue creado con éxito!</p>
                <p>Los datos de su ticket son los siguientes:</p>
            <br>
            <br>
                <div>
                    <h3>Ticket de pedido de compra</h3>
                    <p><strong>Código:</strong> ${ code }</p>
                    <strong>
                        <p>${ purchase_datetime }</p>
                    </strong>
                    <p><strong>Monto total:</strong> ${ amount }</p>
                </div>
            <br>
            <br>
            ${ outOfStock }
                <p>Si quieres volver a visitar nuestros productos haz click en el siguiente link:</p>
                <a href="http://localhost:8080/">Ecommerce Sahumerios</a>
        </div>
    </center>
    `
}