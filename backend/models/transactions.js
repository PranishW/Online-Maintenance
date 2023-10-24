const mongoose = require('mongoose')
const TransactionSchema = new mongoose.Schema({
    flat_owner_name : String,
    transaction_mode : String,
    easepayid : String,
    transaction_date : Date,
    transaction_id : String,
    society_name : String,
    flat_no : String,
    amount:Number,
})
const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction