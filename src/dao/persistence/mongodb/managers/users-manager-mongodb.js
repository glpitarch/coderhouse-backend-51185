import userModel from './../models/user-model.js'

export class UsersManagerMongo {

    async getUsers() {
        try {
            const users = await userModel.find()
            return users
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getUserById(uid) {
        try {
            const user = await userModel.findById(uid)
            return user
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async changeUserRole(uid, userRole) {
        try {      
            if(userRole === 'premium') {
                userRole = 'user'
            }
            else if (userRole === 'user') {
                userRole = 'premium'
            }
            const updatedUser = await userModel.findByIdAndUpdate(uid, { role: userRole })
            return updatedUser
        } catch (error) {
            throw new Error(error.message)
        }
    }
}