import mongoose from 'mongoose';
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
    per_month_maintenance:Number,
    password:{
        type:String,
        required:true
    }
})
const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;