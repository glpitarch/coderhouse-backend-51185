export const deletedPremiumProductEmailTemplate = (productCategory, productName, productCode, id) => {
    return `
    <center>
        <div>
                <h2>Tu producto fue eliminado</h2>
                <p>Lamentablemente tu producto ha sido eliminado por un administrador del sitio.</p>
                <p>Pero no te preocupes, puedes crear un nuevo producto nuevamente.</p>
            <br>
            <br>
                <div>
                    <h3>Producto eliminado</h3>
                    <p><strong>Categoría:</strong> ${ productCategory }</p>
                    <p><strong>Nombre:</strong> ${ productName }</p>
                    <p><strong>Código:</strong> ${ productCode }</p>
                    <p><strong>ID:</strong> ${ id }</p>
                </div>
            <br>
            <br>
                <p>Para dirigirse al sitio puedes hacer click en el siguiente link:</p>
                <a href="http://localhost:8080/">Ecommerce Sahumerios</a>
            <br>
                <p>¡Esperamos que vuelvas a crear más productos para el sitio!</p>
        </div>
    </center>
    `
}