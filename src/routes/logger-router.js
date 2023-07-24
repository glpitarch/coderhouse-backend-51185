import { Router } from "express"

const router = Router()

router.get('/', (req, res) => {
    req.logger.debug('debug logger test')
    req.logger.http('http logger test')
    req.logger.info('info logger test')
    req.logger.warning('warning logger test')
    req.logger.error('error logger test')
    req.logger.fatal('fatal logger test')

    res.send("Logger test has run successfully")
})

export default router