import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()
const MongoURI = process.env.MONGO_URI
const connectToMongo = () =>{
    try {
        mongoose.connect(MongoURI)
        console.log("Connected to DB")
    } catch (error) {
        console.log("Error connecting to DB")
    }
}
export default connectToMongo;