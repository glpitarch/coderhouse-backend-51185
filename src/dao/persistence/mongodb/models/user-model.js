import mongoose from 'mongoose'

const collection = 'user'

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
            type: String,
            unique: true
        },
    age: Number,
    password: String,
    cart: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'carts'
            }
        },
    role: String
})

const userModel = mongoose.model(collection, schema);

export default userModel;