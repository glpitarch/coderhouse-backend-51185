import nodemailer from "nodemailer"
import { config } from "./config.js"

export const emailMailerAccount = config.gmail.emailMailerAccount
const emailMailerPass = config.gmail.emailMailerPass

const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    auth:{
        user: emailMailerAccount,
        pass: emailMailerPass
    },
    secure: false,
    tls:{
        rejectUnauthorized: false
    }
})

export { transporter }