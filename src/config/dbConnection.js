import mongoose from "mongoose"
import { config } from "./config.js"

export const dbConnection = async () => {
    try {
       await mongoose.connect(config.mongo.url)
    } catch (error) {
        console.log('There was a problem trying to connect to the database')     
    }
}


