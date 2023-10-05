import React from "react";
const FlatItem = (props) => {
    const { flat } = props
    const last_paid = new Date(flat.last_paid)
    return (
        <div className="flatitem">
            <div className="flatitemhead">
                <div className="flatitemflatno">{flat.flat_no}</div>
                <div>{flat.flat_owner_name}</div>
            </div>
            {flat.mob_no?<div>Phone No : {flat.mob_no}</div>:<div></div>}
            <div>Maintenance Amount Due : {flat.amount_due !== 0 ? <span><b>Rs. {flat.amount_due}</b></span> : <span>No Due Amount</span>}</div>
            <div className="flatitemfoot">
                <div>Last Paid Date : {last_paid.getDate() - 1 + "-" + (last_paid.getMonth() + 1) + "-" + last_paid.getFullYear()}</div>
                <button className="flatitembtn">View Transactions</button>
            </div>
        </div>
    )
}
export default FlatItem