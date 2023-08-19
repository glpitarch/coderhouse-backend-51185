import mongoose from 'mongoose'

const collection = 'user'

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
            type: String,
            required: true,
            unique: true
        },
    age: Number,
    password: {
        type: String,
        required: true
    },
    cart: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'carts'
            }
        },
    role: {
        type: String,
        required: true,
    },
    documents: {
        type: [
            {
                name: {
                    type: String,
                    required: true
                },
                reference: {
                    type: String,
                    required: true
                }
            }
        ],
        default: []
    },
    last_connection: {
        type: String,
        default: null
    }
})

const userModel = mongoose.model(collection, schema);

export default userModel