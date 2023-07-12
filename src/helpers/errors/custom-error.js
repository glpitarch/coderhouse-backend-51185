export class CustomError{
    static createError({name, cause, message, errorCode}){
        const error = new Error()
        error['name'] = name
        error['cause'] = cause
        error['message'] = message
        error['code'] = errorCode
        console.log("error", error)
        throw error
    }
}