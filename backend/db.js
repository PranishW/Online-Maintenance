import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()
const MongoURI = process.env.MONGO_URI
const connectToMongo = () =>{
    mongoose.connect(MongoURI)
    .then(()=>{
        console.log("Connected to DB")
    })
    .catch(mongoose.MongooseError)
    {
        console.log("Error connecting to DB")
    }
}
export default connectToMongo;