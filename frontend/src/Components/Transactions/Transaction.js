import React from "react";
import '../CSS/transactions.css';
const Transaction = (props) => {
    const { transaction } = props   // unique transaction object
    const txndate = new Date(transaction.transaction_date)
    return (
        <div className="trans-item">
            <div className="txn">
                <span>Transaction ID : </span>
                <span className="id txnid">{transaction.transaction_id}</span>
            </div>
            <div className="txn">
                <span>EasePay  ID : </span>
                <span className="id txnid">{transaction.easepayid}</span>
            </div>
            <div className="txn">
                <span>Flat Owner Name : </span>
                <span className="id">{transaction.flat_owner_name}</span>
            </div>
            <div className="txn">
                <span>Flat No : </span>
                <span className="id">{transaction.flat_no}</span>
            </div>
            <div className="txn">
                <span>Society Name : </span>
                <span className="id">{transaction.society_name}</span>
            </div>
            <div className="txn">
                <span>Date of Transaction : </span>
                <span className="id">{txndate.getDate() + "-" + (txndate.getMonth() + 1) + "-" + txndate.getFullYear()}</span>
            </div>
            <div className="txn">
                <span>Mode Of Payment : </span>
                {transaction.transaction_mode === "MW" && <span className="id">Mobile Wallet</span>}
                {transaction.transaction_mode === "CC" && <span className="id">Debit/Credit Card</span>}
                {transaction.transaction_mode === "NB" && <span className="id">Net Banking</span>}
                {transaction.transaction_mode === "UPI" && <span className="id">UPI</span>}
            </div>
            {transaction.transaction_mode==="NB" && <div className="txn">
                <span>Bank Name : </span>
                <span className="id">{transaction.bank_name}</span>
            </div>}
            <div className="txn">
                <span>Maintenance Amount Paid </span>
                <span className="amt">Rs.{transaction.amount}</span>
            </div>
        </div>
    )
}
export default Transaction