import { Router } from 'express'
import chatModel from '../dao/mongodb/models/chat-model.js'

const router = Router()

router.get('/', async (req,res) => {
    const messages = await chatModel.find()
    return res.send(messages)
})

export default router
