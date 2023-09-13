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

    async getUserByEmail (email) {
        try {
            const user = await this.usersDao.getUserByEmail(email)
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

    async deleteUsers () {
        try {
            const deletedUsers = await this.usersDao.deleteUsers()
            return deletedUsers
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async changeUserRole(uid){
        try {
            const user = await this.getUserById(uid)
            const userRole = user.role
            const userStatus = user.docs_status.overall
            const updatedUser = await this.usersDao.changeUserRole(uid, userRole, userStatus)
            return updatedUser
        } catch (error) {
            throw new Error(error.message)
        }
    }
    
    async checkDocumentation (userData) {
        try {
            const updatedDocumentationStatus = await this.usersDao.checkDocumentation(userData)
            return updatedDocumentationStatus
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