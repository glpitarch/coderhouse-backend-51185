import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';

/*----->_BCRYPT_<-----*/
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validatePassword = (password, user) => bcrypt.compareSync(password, user.password)

/*----->_TIMESTAMP_<-----*/
export const timestamp = () => {
    const date = new Date().toLocaleDateString()
    const time = new Date().toLocaleTimeString()
    const datetime = `Fecha: ${date} - Hora: ${time}`
    return datetime
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname