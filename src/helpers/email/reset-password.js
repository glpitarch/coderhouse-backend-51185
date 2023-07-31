import { transporter, emailMailerAccount } from "./../../config/gmail-config.js"

export const sendResetPassword = async (userEmail, token) => {
    const link = `http://localhost:8080/reset-password?token=${ token }`
    await transporter.sendMail({
        from: emailMailerAccount,
        to: userEmail,
        subject: "Restablecer contraseña en tienda de Sahumerios",
        html: 
        `<div>
            <h2>Restablecer contraseña</h2>
            <p>Haz solicitado un cambio de contraseña.</p>
            <p>Para dirigirte a la página correspondiente para elegir tu nueva contraseña haz click en el siguiente link:</p>
            <a href="${link}">Cambiar mi contraseña</a>
        </div>`
    })
}
