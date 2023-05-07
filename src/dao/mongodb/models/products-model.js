import mongoose from "mongoose";

const collection = 'products'

const schema = new mongoose.Schema({
    category: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    stock: {
        type: Number,
        require: true
    },
    code: {
        type: String,
        require: true
    },
    thumbnail: {
        type: String,
    },
    status: {
        type: Boolean,
    }
})

const productModel = mongoose.model(collection, schema);

export default productModel