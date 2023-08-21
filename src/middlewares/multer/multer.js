import multer from 'multer'
import __dirname from './../../absolute-path.js'
import path from 'path'

/*||=====> To FileFilter <=====||*/
function fileSize (req, file, cb) {
    const maxSizeInBytes = 5 * 1024 * 1024
    if (file.size <= maxSizeInBytes) {
        cb(null, true)
    } else {
        cb(new Error('Archivo no válido. Asegúrate de que el archivo no supere 5 MB.'), false)
    }
}

/*||=====> Profile picture storage <=====||*/
const profileStorage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, path.join(__dirname, "/middlewares/multer/users/images/profiles"))  
    },
    filename: function (req,file,cb) {
        cb(null, `${ req.session.user.email }-profile-${ file.originalname }`)
    }
})

export const uploaderProfile = multer({ 
    storage: profileStorage, 
    fileFilter: fileSize
})

/*||=====> Documents storage <=====||*/
const documentStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname,"/middlewares/multer/users/documents"))
    },
    filename: function(req, file, cb) {
        cb(null, `${ req.session.user.email }-document-${ file.originalname }`)
    }
})

export const uploaderDocument = multer({ storage: documentStorage })

/*||=====> Products pictures storage <=====||*/
const productStorage= multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, "/middlewares/multer/users/images/products"))
    },
    filename: function(req,file,cb) {
        cb(null, `${ req.body.code }-image-${ file.originalname }`)
    }
})

export const uploaderProduct = multer({ storage: productStorage})