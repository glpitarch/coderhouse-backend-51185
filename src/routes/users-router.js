import { Router } from "express"
import UsersController from "../dao/controllers/users-controller.js"
import { handlePolicies } from "../middlewares/policies.js"
import { authSession } from "../middlewares/auth-session.js"
import { uploaderDocument } from "./../middlewares/multer/multer.js"

const router = Router()
const usersController = new UsersController()

router.get('/', handlePolicies(['ADMIN']), usersController.getUsers)

router.delete('/:uid', handlePolicies(['ADMIN']), usersController.deleteUser)

router.put('/premium/:uid', handlePolicies(['ADMIN']), usersController.changeUserRole)

router.post('/:uid/documents',
    authSession,
    uploaderDocument.fields(
        [
            { name: "identificacion", maxCount: 1 }, 
            { name: "domicilio", maxCount: 1 }, 
            { name: "estadoDeCuenta", maxCount: 1 }
        ]
    ),
    usersController.uploadUserDocuments
)

export default router