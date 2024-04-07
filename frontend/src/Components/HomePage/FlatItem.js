import React, { useContext } from "react";
import TransactionContext from "../Transactions/TransactionContext";
const FlatItem = (props) => {
    const { flat } = props // unique housing society flat object
    const last_paid = new Date(flat.last_paid)
    const transcontext = useContext(TransactionContext)
    const {getusertransactions} = transcontext // all transactions performed by flatowner till date
    const handleClick = () =>{
        getusertransactions(flat.flat_no)
    }
    return (
        <div className="flatitem">
            <div className="flatitemhead">
                <div className="flatitemflatno">{flat.flat_no}</div>
                <div>{flat.flat_owner_name}</div>
            </div>
            {flat.mob_no?<div>Phone No : {flat.mob_no}</div>:<div></div>}
            <div>Maintenance Amount Due : {flat.amount_due !== 0 ? <span><b>Rs. {flat.amount_due}</b></span> : <span>No Due Amount</span>}</div>
            <div className="flatitemfoot">
                <div>Last Paid Date : {last_paid.getDate() + "-" + (last_paid.getMonth() + 1) + "-" + last_paid.getFullYear()}</div>
                <button data-bs-toggle="modal" data-bs-target="#exampleModal5" className="flatitembtn" onClick={handleClick}>View Transactions</button>
            </div>
        </div>
    )
}
export default FlatItem