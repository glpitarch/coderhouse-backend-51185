import { Router } from "express"
import UsersController from "./../dao/controllers/users-controller.js"
import { handlePolicies } from "./../middlewares/policies.js"

const router = Router()
const usersController = new UsersController()

router.get('/', handlePolicies(['ADMIN']), usersController.getUsers)

router.put('/premium/:uid', handlePolicies(['ADMIN']), usersController.changeUserRole)

export default router