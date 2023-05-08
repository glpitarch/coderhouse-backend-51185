import { Router } from "express";
import productManager from "../dao/file-system/managers/productManager.js"

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