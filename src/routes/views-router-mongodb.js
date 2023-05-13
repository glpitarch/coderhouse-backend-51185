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

router.get('/carts/:cid', async (req,res)=>{
    const cid = req.params.cid
    let cart = await cartModel.findById(cid).populate('products._id').lean()
    cart = cart.products
    console.log(cart)
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