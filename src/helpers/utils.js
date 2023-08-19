import bcrypt from 'bcrypt'

/*||=====> BCRYPT <=====||*/
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validatePassword = (password, user) => bcrypt.compareSync(password, user.password)

/*||=====> TIMESTAMP <=====||*/
export const timestamp = () => {
    const date = new Date().toLocaleDateString()
    const time = new Date().toLocaleTimeString()
    const datetime = `Fecha: ${ date } - Hora: ${ time }`
    return datetime
}
