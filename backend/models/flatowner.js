const mongoose = require('mongoose')
const FlatOwnerSchema = new mongoose.Schema({
    flat_owner_name:{
        type:String,
        required:true
    },
    mob_no:Number,
    flat_no:{
        type:String,
        required:true,
    },
    society_name:{
        type:String,
        required:true,
    },
    amount_due:Number,
    last_paid:{
        type:Date,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
const FlatOwner = mongoose.model('FlatOwner', FlatOwnerSchema);
module.exports = FlatOwner