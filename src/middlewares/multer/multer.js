import multer from 'multer'
import __dirname from './../../absolute-path.js'
import path from 'path'

const FILE_SIZE_IN_KB = 1000

/*||=====> Documents storage <=====||*/
const documentStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname,"/middlewares/multer/users/documents"))
    },
    filename: function(req, file, cb) {
        cb(null, `${ req.session.user.email }-document-${ file.originalname }`)
    }
})

export const uploaderDocument = multer({
     storage: documentStorage,
     limits: {
        fileSize: FILE_SIZE_IN_KB * 1000
    } 
})

/*||=====> Profile picture storage <=====||*/
const profileStorage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, path.join(__dirname, "/middlewares/multer/users/images/profiles"))  
    },
    filename: function (req, file, cb) {
        cb(null, `${ req.session.user.email }-avatar-${ file.originalname }`)
    }
})

export const uploaderProfile = multer({ 
    storage: profileStorage,
    limits: {
        fileSize: FILE_SIZE_IN_KB * 1000
    } 
})

/*||=====> Products pictures storage <=====||*/
const productStorage= multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, "/middlewares/multer/users/images/products"))
    },
    filename: function(req,file,cb) {
        cb(null, `${ req.params.pid }-product-${ file.originalname }`)
    }
})

export const uploaderProduct = multer({
     storage: productStorage,
     limits: {
        fileSize: FILE_SIZE_IN_KB * 1000
    } 
})