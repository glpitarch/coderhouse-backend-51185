import { Router } from "express"
import UsersController from "../dao/controllers/users-controller.js"
import { handlePolicies } from "../middlewares/policies.js"
import { authSession } from "../middlewares/auth-session.js"
import { uploaderDocument, uploaderProduct, uploaderProfile } from "./../middlewares/multer/multer.js"

const router = Router()
const usersController = new UsersController()

router.get('/', handlePolicies(['ADMIN']), usersController.getUsers)

router.delete('/:uid', handlePolicies(['ADMIN']), usersController.deleteUser)

router.put('/premium/:uid', handlePolicies(['ADMIN']), usersController.changeUserRole)

router.post('/:uid/documents',
    handlePolicies(['ONLY_USERS']),
    uploaderDocument.fields(
        [
            { name: "identificacion", maxCount: 1 }, 
            { name: "domicilio", maxCount: 1 }, 
            { name: "estadoDeCuenta", maxCount: 1 }
        ]
    ),
    usersController.uploadUserDocuments
)

router.post('/:uid/images/products/:pid', handlePolicies(['PREMIUM']), uploaderProduct.single("productPremiumImage"), usersController.uploadUserProductsImages)

router.post('/:uid/images/profile', handlePolicies(['ONLY_USERS']), uploaderProfile.single("profileImage"), usersController.uploadUserProfileImage)

export default router