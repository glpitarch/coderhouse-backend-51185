import { Router } from "express";
import productModel from './../dao/mongodb/models/products-model.js'
import cartModel from "../dao/mongodb/models/carts-model.js";

const router = Router();

router.get('/', async (req,res)=>{
    let products = await productModel.find().lean()
    let titleTag = 'Home'
    res.render('home', { 
        title: titleTag,
        style: 'index.css',
        products
    });
})

router.get('/products', async (req,res)=>{
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

    res.render('products', { 
        title: titleTag,
        style: 'index.css',
        products,
        searchError,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage
    })
})

router.get('/carts/:cid', async (req,res)=>{
    const cid = req.params.cid
    let cart = await cartModel.findById(cid).populate('products._id').lean()
    cart = cart.products
    let titleTag = 'Cart'
    res.render('cart', { 
        title: titleTag,
        style: 'index.css',
        cart
    });
})

router.get('/realtimeproducts', async (req,res)=>{
    let titleTag = 'Real time products'
    res.render('realTimeProducts', { 
        title: titleTag,
        style: 'index.css'
    });
})

router.get('/chat', async (req,res)=>{
    let titleTag = 'Online Chat'
    res.render('chat', { 
        title: titleTag,
        style: 'index.css'
    });
})

export default router;