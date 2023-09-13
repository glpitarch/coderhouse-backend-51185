import dotenv from 'dotenv'
import path from "path"
import __dirname from './../absolute-path.js'
import { Command } from 'commander'

const program = new Command();

program
.option("-mode <modo>", "Modo de inicio", "dev") 
program.parse()

const environment = program.opts()

console.log(environment)

const pathEnvironment = environment.Mode === "prod" ? path.join(__dirname, "../.env.production") : path.join(__dirname, "../.env.development")

dotenv.config({ path: pathEnvironment })

const PORT = process.env.PORT
const MONGO_URL = process.env.MONGO_URL
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASS = process.env.ADMIN_PASS
const SECRET_WORD = process.env.SECRET_WORD
const PERSISTENCE = process.env.PERSISTENCE
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const CALLBACK_URL = process.env.CALLBACK_URL
const MAILER_EMAIL = process.env.MAILER_EMAIL
const MAILER_EMAIL_PASS = process.env.MAILER_EMAIL_PASS
const EMAIL_TOKEN_SECRET_KEY = process.env.EMAIL_TOKEN_SECRET_KEY
const ENVIRONMENT = process.env.ENVIRONMENT

export const config = {
    server: {
        port: PORT||8080,
        persistence: PERSISTENCE
    },
    mongo: {
        url: MONGO_URL
    },
    auth: {
        email: ADMIN_EMAIL,
        pass: ADMIN_PASS
    },
    secretWord: {
        pass: SECRET_WORD
    },
    github: {
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: CALLBACK_URL
    },
    gmail: {
        emailMailerAccount: MAILER_EMAIL,
        emailMailerPass: MAILER_EMAIL_PASS,
        emailTokenSecretKey: EMAIL_TOKEN_SECRET_KEY
    },
    logger: {
        environment: ENVIRONMENT
    }
}