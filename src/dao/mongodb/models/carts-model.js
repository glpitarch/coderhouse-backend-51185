import mongoose from "mongoose";

const collection = 'carts'

const schema = new mongoose.Schema({
    products: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity: { type: Number, required: true }
        }
    ]
})

const cartModel = mongoose.model(collection, schema);

export default cartModel