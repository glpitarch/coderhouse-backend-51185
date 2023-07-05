import mongoose from "mongoose"
import { timestamp } from "../../../../utils.js"

const collection = 'ticket'

const schema = new mongoose.Schema({
    code: {
        type: String,
        unique: true
    },
    purchase_datetime: {
        type: String,
        default: timestamp()
    },
    amount: Number,
    purchaser: String
})

const ticketModel = mongoose.model(collection, schema);

export default ticketModel