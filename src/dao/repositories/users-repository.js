import GetUserDataDto from './../dto/users-data-dto.js'

export class UsersRepository {
    constructor(usersDao){
        this.usersDao = usersDao;
    }

    async getUsers(){
        try {
            const users = await this.usersDao.getUsers()
            let dtoUsers = []
            users.forEach(user => {
                const dtoUser = new GetUserDataDto(user)
                dtoUsers.push(dtoUser)
            })
            return dtoUsers
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getUserById (uid) {
        try {
            const user = await this.usersDao.getUserById(uid)
            return user
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async deleteUser (uid) {
        try {
            const deletedUser = await this.usersDao.deleteUser(uid)
            return deletedUser
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async checkDocumentation (userData) {
        try {
            let checkDocumentation = []
            let identificacion = await userData.documents.find(doc => doc.name === 'identificacion')
            if (identificacion != undefined) {
                identificacion = true
            } else {
                identificacion = false
            }
            checkDocumentation.push(identificacion)
            let domicilio = await userData.documents.find(doc => doc.name === 'domicilio')
            if (domicilio != undefined) {
                domicilio = true
            } else {
                domicilio = false
            }
            checkDocumentation.push(domicilio)
            let estadoDeCuenta = await userData.documents.find(doc => doc.name === 'estadoDeCuenta')
            if (estadoDeCuenta != undefined) {
                estadoDeCuenta = true
            } else {
                estadoDeCuenta = false
            }
            checkDocumentation.push(estadoDeCuenta)
            return checkDocumentation
        } catch (error) {
            return error.message
        }
    }

    async changeUserRole(uid){
        try {
            const user = await this.getUserById(uid)
            const userRole = user.role
            const userStatus = user.status
            const updatedUser = await this.usersDao.changeUserRole(uid, userRole, userStatus)
            return updatedUser
        } catch (error) {
            throw new Error(error.message)
        }
    }
}