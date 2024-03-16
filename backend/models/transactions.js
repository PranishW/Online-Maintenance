import mongoose from 'mongoose';
const TransactionSchema = new mongoose.Schema({
    flat_owner_name : String,
    transaction_mode : String,
    easepayid : String,
    transaction_date : Date,
    transaction_id : String,
    society_name : String,
    flat_no : String,
    amount:Number,
    bank_name:String
})
const Transaction = mongoose.model('Transaction', TransactionSchema);
export default Transaction;