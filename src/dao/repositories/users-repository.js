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
    
    async checkDocumentation (userData) {
        try {
            let checkDocumentation = {}
            let identificacion = await userData.documents.find(doc => doc.name === 'identificacion')
            if (identificacion != undefined) {
                identificacion = 'completo'
            } else {
                identificacion = 'faltante'
            }
            checkDocumentation.identificacion = identificacion
            let domicilio = await userData.documents.find(doc => doc.name === 'domicilio')
            if (domicilio != undefined) {
                domicilio = 'completo'
            } else {
                domicilio = 'faltante'
            }
            checkDocumentation.domicilio = domicilio
            let estadoDeCuenta = await userData.documents.find(doc => doc.name === 'estadoDeCuenta')
            if (estadoDeCuenta != undefined) {
                estadoDeCuenta = 'completo'
            } else {
                estadoDeCuenta = 'faltante'
            }
            checkDocumentation.estadoDeCuenta = estadoDeCuenta
            return checkDocumentation
        } catch (error) {
            return error.message
        }
    }

    async uploadUserDocuments (userId, receivedDocs) {
        try {
            const updateUser = await this.usersDao.uploadUserDocuments(userId, receivedDocs)
            return updateUser
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async uploadUserProfileImage (userId, filePath) {
        try {
            const updateUser = await this.usersDao.uploadUserProfileImage(userId, filePath)
            return updateUser
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async uploadUserProductsImages (userId, filePath) {
        try {
            const result = await this.usersDao.uploadUserProductsImages(userId, filePath)
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }
}