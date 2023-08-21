import userModel from './../models/user-model.js'

export class UsersManagerMongo {

    async getUsers () {
        try {
            const users = await userModel.find()
            return users
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getUserById (uid) {
        try {
            const user = await userModel.findById(uid)
            return user
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async deleteUser (uid) {
        try {
            const deletedUser = await userModel.findByIdAndDelete(uid)
            return deletedUser
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async changeUserRole (uid, userRole, userStatus) {
        try {      
            if(userRole === 'premium') {
                userRole = 'user'
            }
            else if (userRole === 'user' && userStatus === 'completo') {
                userRole = 'premium'
            } else {
                throw new Error(`El usuario no tiene la documentación completa para hacer el cambio a usuario PREMIUM`)
            }
            const updatedUser = await userModel.findByIdAndUpdate(uid, { role: userRole })
            return updatedUser
        } catch (error) {
            throw new Error(error.message)
        }
    }
}