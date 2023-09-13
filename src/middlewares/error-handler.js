import { EError } from "./../helpers/errors/enums/EError.js"

export const errorHandler = (error, req, res, next) => {
    switch (error.code) {
        case EError.DATABASE_ERROR:
            res.json({
                status: error.code, 
                cause: error.cause, 
                message: error.message
            })
            break
        case EError.INVALID_JSON:
            res.json({
                status: error.code, 
                cause: error.cause, 
                message: error.message
            })
            break
        case EError.AUTH_ERROR:
            res.json({
                status: error.code, 
                cause: error.cause, 
                message: error.message
            })
            break
        case EError.INVALID_PARAM:
            res.json({
                status: error.code, 
                cause: error.cause, 
                message: error.message
            })
            break
        case EError.INVALID_QUERY:
            res.json({
                status: error.code, 
                cause: error.cause, 
                message: error.message
            })
            break
        default:
            res.json({
                status: 'error', 
                message: `An error has ocurred: please contact support.`
            })
            break
    }
    next()
}