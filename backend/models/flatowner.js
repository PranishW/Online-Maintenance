const mongoose = require('mongoose')
const AdminSchema = new mongoose.Schema({
    flat_owner_name:{
        type:String,
        required:true
    },
    mob_no:{
        type:Number,
        required:true,
        unique:true
    },
    flat_no:{
        type:String,
        required:true,
        unique:true
    },
    society_name:{
        type:String,
        required:true,
        unique:true
    },
    maintenance_amount:Number,
    last_paid:{
        type:Date,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin