import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT
const MONGO_URL = process.env.MONGO_URL
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASS = process.env.ADMIN_PASS
const SECRET_WORD = process.env.SECRET_WORD

export const config = {
    server: {
        port: PORT
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
    }
}