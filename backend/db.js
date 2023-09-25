const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config()
// "mongodb://localhost:27017/eRegistration"
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
module.exports= connectToMongo;