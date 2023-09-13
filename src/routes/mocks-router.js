import { Router } from "express"
import { generateProduct } from "./../helpers/mocks/products-mock.js"
import { handlePolicies } from "./../middlewares/policies.js"

const router = Router()

router.get('/', handlePolicies(['ADMIN']), (req,res) => {
    let qty = req.query.qty
    console.log(qty)
    if (!qty) {
        qty = 100
    }
    let products = []
    for (let i = 0; i < qty; i++) {
        const product = generateProduct()
        products.push(product)
    }
    res.json({products})
})

export default router