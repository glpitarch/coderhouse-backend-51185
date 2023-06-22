import productModel from './../persistence/mongodb/models/products-model.js'
import cartModel from './../persistence/mongodb/models/carts-model.js'

export default class ViewsController {
    async login (req,res) {
        const titleTag = 'login'
        res.render('login', { 
            title: titleTag,
            style: 'styles.css'
        })
    }  

    async profile (req,res) {
        const titleTag = 'Perfil'
        let user = req.session.user
        const isAdmin = user.role == 'admin' ? true : false
        const isExternalAcces = user.password == '' ? true : false

        res.render('profile', {
            user: req.session.user,
            isAdmin,
            isExternalAcces,
            title: titleTag,
            style: 'styles.css'
        })
    }

    async register (req,res) {
        const titleTag = 'Registro'
        res.render('register', { 
            title: titleTag,
            style: 'styles.css'
        })
    }

    async products (req,res) {
        const regex = /^[0-9]*$/;
        const titleTag = 'Productos'
    
        let query = req.query.query
        let limit = parseInt(req.query.limit)
        let sort = req.query.sort
        let { page = 1 } = req.query
    
        let isNumber = regex.test(page)
        if(page < 0 || isNumber == false || page.length > 3) {
            return res.status(400).send('Incorrect page value')
        }
    
        let queryFilter = {}
        if (query) {
            queryFilter = JSON.parse(query)
        }
    
        let limitOption = 10
        if (limit) {
            limitOption = limit
        }
    
        let sortOption = {}
        if (sort == 'asc') {
            sortOption = { price: 1 }
        } else if (sort == 'desc') {
            sortOption = { price: -1 }
        }
        
        const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await productModel.paginate( 
            queryFilter, 
            { limit: limitOption, page: page, sort: sortOption, lean: true }
        )
    
        let products = docs
        let productsLength = products.length
    
        let searchError = ''
        if (productsLength == 0) {
            searchError = 'No se ha encontrado ningun producto con los filtros solicitados'
        }
    
        let user = req.session.user
        const isAdmin = user.role == 'admin' ? true : false
        const isExternalAcces = user.password == '' ? true : false
    
        res.render('products', { 
            title: titleTag,
            style: 'styles.css',
            products,
            user,
            isAdmin,
            isExternalAcces,
            searchError,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage
        })
    }

    async chat (req,res) {
        const titleTag = 'Online Chat'
        res.render('chat', { 
            title: titleTag,
            style: 'styles.css'
        })
    }

    async realTimeProducts (req,res) {
        const titleTag = 'Real time products'
        res.render('realTimeProducts', { 
            title: titleTag,
            style: 'styles.css'
        })
    }

    async cart (req,res) {
        const titleTag = 'Cart'
        const cid = req.params.cid
        let cart = await cartModel.findById(cid).populate('products._id').lean()
        cart = cart.products
        res.render('cart', { 
            title: titleTag,
            style: 'styles.css',
            cart
        })
    }
}