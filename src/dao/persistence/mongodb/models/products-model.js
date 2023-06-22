import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

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
        require: true,
        unique: true
    },
    thumbnail: {
        type: Array
    },
    status: {
        type: Boolean,
    }
})

schema.plugin(mongoosePaginate)

const productModel = mongoose.model(collection, schema);

export default productModel