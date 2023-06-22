import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validatePassword = (password, user) => bcrypt.compareSync(password, user.password)
export const authSession = (req,res,next) => {
    const authHeader = req.session.user
    if(!authHeader){
        return res.status(401).send({
            status: "error",
            error: "Unauthorized"
        })
    }
    next() 
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname