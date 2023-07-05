import { Router } from 'express'
import chatModel from './../dao/persistence/mongodb/models/chat-model.js'
import { handlePolicies } from './../middlewares/policies.js'

const router = Router()

router.get('/', handlePolicies(['ONLY_USERS']), async (req,res) => {
    const messages = await chatModel.find()
    return res.send(messages)
})

export default router
