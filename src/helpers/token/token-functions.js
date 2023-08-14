import jwt from 'jsonwebtoken'
import { config } from './../../config/config.js'

/*||=====> EMAIL TOKEN <=====||*/
export const generateEmailToken = (email, expireTime) => {
    const token = jwt.sign({ email }, config.gmail.emailTokenSecretKey, { expiresIn: expireTime })
    return token
}

export const verifyEmailToken = (token) => {
    try {
        const info = jwt.verify(token, config.gmail.emailTokenSecretKey)
        return info.email
    } catch (error) {
        console.log(error.message)
        return null
    }
}
