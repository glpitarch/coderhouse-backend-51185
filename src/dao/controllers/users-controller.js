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
            let uid = req.params.uid
            const user = await usersServices.getUserById(uid)
            res.json({
                status: "success",
                payload: user
            })
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async changeUserRole (req, res, next) {
        try {
            let uid = req.params.uid
            const updatedUser = await usersServices.changeUserRole(uid)
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
}