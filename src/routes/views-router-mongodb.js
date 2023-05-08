import { Router } from "express";
import productModel from './../dao/mongodb/models/products-model.js'

const router = Router();

router.get('/', async (req,res)=>{
    let products = await productManager.getProducts()
    let titleTag = 'Home'
    res.render('home', { 
        title: titleTag,
        style: 'index.css',
        products
    });
})

router.get('/realtimeproducts', async (req,res)=>{
    let titleTag = 'Real time products'
    res.render('realTimeProducts', { 
        title: titleTag,
        style: 'index.css'
    });
})

export default router;