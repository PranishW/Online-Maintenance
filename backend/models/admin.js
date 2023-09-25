const mongoose = require('mongoose')
const AdminSchema = new mongoose.Schema({
    admin_name:{
        type:String,
        required:true
    },
    mob_no:{
        type:Number,
        required:true,
        unique:true
    },
    society_name:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})
const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin