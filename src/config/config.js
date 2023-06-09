import dotenv from 'dotenv'

dotenv.config()

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

export const config = {
    server: {
        port: PORT,
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
        emailMailerPass: MAILER_EMAIL_PASS
    }
}