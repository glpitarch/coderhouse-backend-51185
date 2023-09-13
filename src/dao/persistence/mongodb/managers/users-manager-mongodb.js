import userModel from './../models/user-model.js'
import __dirname from './../../../../absolute-path.js'
import { DAY_IN_MS } from '././../../../../helpers/utils.js'
import { transporter, emailMailerAccount } from './../../../../config/gmail-config.js'
import { deletedUserEmailTemplate } from './../../../../helpers/email/deleted-user.js'

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

    async getUserByEmail (email) {
        try {
            const user = await userModel.findOne({ email: email })
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

    async deleteUsers () {
        try {
            const users = await this.getUsers()
            const actualDate = new Date().getTime() / DAY_IN_MS
            let usersToDelete = []
            users.forEach(user => {
                if (user.role === 'user' || user.role === 'premium') {
                    if (user.last_connection === null) {
                        usersToDelete.push(user.email)
                    } else {
                        let last_connection = user.last_connection
                        const dateRegex = /Fecha: (\d{1,2}\/\d{1,2}\/\d{4})/
                        const dateMatch = last_connection.match(dateRegex)
                        let date = dateMatch[1]
                        date = date.split('/')
                        const day = parseInt(date[0], 10)
                        const month = parseInt(date[1], 10)
                        const year = parseInt(date[2], 10)
                        let newDate = new Date(year, month - 1, day)
                        last_connection = newDate.getTime() / DAY_IN_MS
                        let timeDifference = actualDate - last_connection
                        if (timeDifference > 2) {
                            usersToDelete.push(user.email)
                        }
                    }
                }
            })
            usersToDelete.forEach(async (userEmail) => {
                await transporter.sendMail({
                    from: emailMailerAccount,
                    to: userEmail,
                    subject: "Usuario eliminado",
                    html: deletedUserEmailTemplate()
                })
                await userModel.findOneAndDelete({ email: userEmail })
            })
            return usersToDelete
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

    async checkDocumentation (userData) {
        try {
            let documentationStatus = {}
            let identificacion = await userData.documents.find(doc => doc.name === 'identificacion')
            if (identificacion != undefined) {
                identificacion = 'completo'
            } else {
                identificacion = 'faltante'
            }
            documentationStatus.identificacion = identificacion
            let domicilio = await userData.documents.find(doc => doc.name === 'domicilio')
            if (domicilio != undefined) {
                domicilio = 'completo'
            } else {
                domicilio = 'faltante'
            }
            documentationStatus.domicilio = domicilio
            let estadoDeCuenta = await userData.documents.find(doc => doc.name === 'estadoDeCuenta')
            if (estadoDeCuenta != undefined) {
                estadoDeCuenta = 'completo'
            } else {
                estadoDeCuenta = 'faltante'
            }
            documentationStatus.estadoDeCuenta = estadoDeCuenta
            userData.docs_status.each = documentationStatus
            const updatedDocumentationStatus = await userModel.findByIdAndUpdate(userData._id, { $set: { 'docs_status.each': userData.docs_status.each }}, { new: true })
            return updatedDocumentationStatus
        } catch (error) {
            return error.message
        }
    }

    async uploadUserDocuments (userId, receivedDocs) {
        try {
            const user = await userModel.findById(userId)
            user.documents = receivedDocs
            if(receivedDocs.length === 3) {
                user.docs_status.overall = "completo"
            } else {
                user.docs_status.overall = "incompleto"
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