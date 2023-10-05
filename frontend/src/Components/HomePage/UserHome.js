import React, { useContext } from "react";
import userContext from "../Login/userContext";
const UserHome = () => {
    const context = useContext(userContext)
    const { userData } = context
    const last_paid = new Date(userData.last_paid)
    return (
        <div className="main">
            <h1 className="head">Home Page</h1>
            <h2 className="head2">{userData.flat_no} Due Maintenance</h2>
            <div className="usermain">
            <div>Flat Owner Name : {userData.flat_owner_name}</div>
                <div>Maintenance Amount Due : {userData.amount_due !== 0 ? <span>
                    <b>Rs. {userData.amount_due}</b></span> : <span>No Due Amount to Pay</span>}
                </div>
                <div>Last Paid Date (DD-MM-YYYY) : {last_paid.getDate() + "-" + (last_paid.getMonth() + 1) + "-" + last_paid.getFullYear()}</div>
                {userData.amount_due !== 0 ?<button className="userpaybtn">Pay Now</button>:null}
            </div>
        </div>
    )
}
export default UserHome