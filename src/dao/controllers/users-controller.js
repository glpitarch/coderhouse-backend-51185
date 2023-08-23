import { usersServices } from './../repositories/index.js'

export default class UsersController {
    async getUsers (req, res, next) {
        try {
            const users = await usersServices.getUsers()
            res.json({
                status: "success",
                payload: users
            })
        } catch (error) {
            req.logger.error('GET users failed')
            next(error)
        }
    }

    async getUserById (req, res, next) {
        try {
            const userId = req.params.uid
            const user = await usersServices.getUserById(userId)
            res.json({
                status: "success",
                payload: user
            })
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async deleteUser (req, res, next) {
        try {
            const userId = req.params.uid
            const deletedUser = await usersServices.deleteUser(userId)
            res.json({
                status: "success",
                payload: deletedUser
            })
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async changeUserRole (req, res, next) {
        try {
            const userId = req.params.uid
            const updatedUser = await usersServices.changeUserRole(userId)
            res.json({
                status: "success",
                payload: updatedUser
            })
        } catch (error) {
            req.logger.error(
                `Change user role has failed'.
                ${ error }`
            )
            next(error)
        }
    }

    async checkDocumentation (req, res, next) {
        try {
            const userId = req.params.uid
            const userData = await usersServices.getUserById(userId)
            const documentationStatus = await usersServices.checkDocumentation(userData)
            res.json({ documentationStatus })
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async uploadUserDocuments (req, res, next) {
        try {
            const userId = req.params.uid
            const identificacion = req.files['identificacion']?.[0] || null
            const domicilio = req.files['domicilio']?.[0] || null
            const estadoDeCuenta = req.files['estadoDeCuenta']?.[0] || null
            const receivedDocs = []
            if(identificacion) {
                receivedDocs.push({ name: "identificacion", reference: identificacion.filename })
            }
            if(domicilio) {
                receivedDocs.push({ name: "domicilio", reference: domicilio.filename })
            }
            if(estadoDeCuenta) {
                receivedDocs.push({ name: "estadoDeCuenta", reference: estadoDeCuenta.filename })
            }
            await usersServices.uploadUserDocuments(userId, receivedDocs)
            const userData = await usersServices.getUserById(userId)
            const documentationStatus = await usersServices.checkDocumentation(userData)
            req.logger.info(`Document uploaded by user ID: ${userId}`)
            res.json(documentationStatus.docs_status)
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async uploadUserProfileImage (req, res, next) {
        try {
            const userId = req.params.uid
            const file = req.file
            if (!file) {
                res.json('Debe seleccionar el archivo deseado y reiterar el envio.')
            } else {
                const profileImage = Object.values(req.file).includes('profileImage') || false
                if (profileImage === true) {
                    const filePath = file.path
                    await usersServices.uploadUserProfileImage(userId, filePath)
                    req.logger.info(`Profile Image uploaded by user ID: ${userId}`)
                    res.json({ file })
                } else {
                    throw new Error('No existe profileName como nombre del campo del archivo')
                }
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async uploadUserProductsImages (req, res, next) {
        try {
            const userId = req.params.uid
            const file = req.file
            if (!file) {
                res.json('Debe seleccionar el archivo deseado y reiterar el envio.')
            } else {
                const receivedImage = Object.values(req.file).includes('productPremiumImage') || false
                if (receivedImage === true) {
                    const filePath = file.path
                    const payload = await usersServices.uploadUserProductsImages(userId, filePath)
                    if (payload === 'El archivo que intentas subir ya existe') {
                        res.json({ payload })
                    } else {
                        req.logger.info(`Product Image uploaded by user ID: ${ userId }`)
                        res.json({ payload })
                    }
                } else {
                    throw new Error('No existe productPremiumImage como nombre del campo del archivo')
                }
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }
}