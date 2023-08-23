import path from 'path'
import userModel from './../models/user-model.js'
import __dirname from './../../../../absolute-path.js'

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

    async uploadUserDocuments (userId, receivedDocs) {
        try {
            const user = await userModel.findById(userId)
            user.documents = receivedDocs
            if(receivedDocs.length === 3) {
                user.status = "completo"
            } else {
                user.status = "incompleto"
            }
            const updateUser = await userModel.findByIdAndUpdate(user._id, user)
            return updateUser
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async uploadUserProfileImage (userId, filePath) {
        try {
            const user = await userModel.findById(userId)
            user.avatar = filePath
            const result = await userModel.findByIdAndUpdate(user._id, user)
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async uploadUserProductsImages (userId, filePath) {
        try {
            const user = await userModel.findById(userId)
            const howManyImages = user.premium_images.length
            if (howManyImages === 0) {
                user.premium_images[0] = filePath
                const result = await userModel.findByIdAndUpdate(user._id, user)
                return result
            } else if (!user.premium_images.includes(filePath)) {
                user.premium_images[ howManyImages ] = filePath
                const result = await userModel.findByIdAndUpdate(user._id, user)
                return result
            } else {
                return 'El archivo que intentas subir ya existe'
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }
}