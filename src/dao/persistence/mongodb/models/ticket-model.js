import mongoose from "mongoose"

const collection = 'ticket'

const schema = new mongoose.Schema({
    code: {
        type: String,
        unique: true
    },
    purchase_datetime: {
        type: String
    },
    amount: Number,
    purchaser: String
})

const ticketModel = mongoose.model(collection, schema);

export default ticketModel