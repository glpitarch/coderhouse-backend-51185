import mongoose from "mongoose";

const collection = 'carts'

const schema = new mongoose.Schema({
    products: [{
        quantity: { type: Number, required: true }
    }]
})

const cartModel = mongoose.model(collection, schema);

export default cartModel