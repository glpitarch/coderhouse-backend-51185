export const deletedUserEmailTemplate = () => {
    return `
    <center>
        <div>
                <h2>Tu cuenta fue eliminada</h2>
                <p>Lamentablemente tu cuenta ha sido eliminada debido a tu inactividad mayor a 2 días.</p>
                <p>Pero no te preocupes, puedes volver a crear una cuenta entrando en el siguiente link:</p>
            <br>
                <a href="http://localhost:8080/register">Ecommerce Sahumerios - registro</a>
            <br>
            <br>
                <p>¡Te esperamos ver nuevamente!</p>
        </div>
    </center>
    `
}