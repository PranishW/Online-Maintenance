import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import "./CSS/payment.css";
import { PopupContext } from "../App";
const Payment = () => {
    const unique_id = uuid();
    const txnid = unique_id.slice(0, 10); // create unique transaction id
    const { state } = useLocation() // data sent from home page fetched using useLocation Hook
    const navigate = useNavigate()  // admin cannot initiate payment
    const [error, setError] = useState({})      // set form validation errors
    const alert = useContext(PopupContext)
    const { showPopup } = alert
    const [user, setUser] = useState({
        txnid: txnid, amount: `${state.amount_due}`, email: "", phone: "", name: state.flat_owner_name,
        productinfo: `${state.flat_no} ${state.society_name}`, udf6: "", udf7: "", udf8: "", udf9: "", udf10: "",
        furl: "https://online-maintenance.onrender.com/api/payment/response", surl: "https://online-maintenance.onrender.com/api/payment/response",
        udf1: "", udf2: "", udf3: "", udf4: "", udf5: "",
    })  // data sent to initiate payment
    const [loading, setloading] = useState(false)       // set loader
    const handleClick = async () => {
        setloading(true)
        validate()
        const response = await fetch('https://online-maintenance.onrender.com/api/payment/initiate_payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        const json = await response.json()
        if (json.success) {
            if (json.response.status) {
                window.location.assign(`https://testpay.easebuzz.in/pay/${json.response.data}`);   // redirecting to EaseBuzz payment platform
            }
            else {
                showPopup("Payment Initiation Failed ,Please Retry", "danger")
            }
        }
        else if (json.error) {
            showPopup(json.error, "danger")
        }
        setloading(false)
    }
    const onChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }
    const validate = () => {
        const errors = {}
        if (!user.email) {
            errors.email = "Email is required!!"
        }
        if (!user.phone) {
            errors.phone = "Phone no is required!!"
        }
        setError(errors)
    }
    useEffect(() => {
        if (localStorage.getItem('admin')) {
            navigate("/")
        }
    })
    return (
        <div className="home-page">
            {state && <div className="main">
                <h1 className="head">Payment Form</h1>
                <div className="pay-form">
                    <div className="userpay">
                        <span>Society Name : {state.society_name}</span>
                        <span>Flat No : {state.flat_no}</span>

                    </div>
                    <div className="userpay">
                        Flat Owner Name : {state.flat_owner_name}
                    </div>
                    <div className="payfield">
                        <div className="field1">
                            <label className="pay-label">Email</label>
                            <div>
                                <input type="email" className="payinput" placeholder="Enter email" name="email" onChange={onChange} value={user.email} ></input>
                                <div className="error-field">{error.email}</div>
                            </div>
                        </div>
                        <div className="field1">
                            <label className="pay-label">Phone No</label>
                            <div>
                                <input type="tel" className="payinput" placeholder="Enter phone no" name="phone" onChange={onChange} value={user.phone} ></input>
                                <div className="error-field">{error.phone}</div>
                            </div>
                        </div>
                    </div>
                    <div className="payamt">
                        Maintenance Amount : <span className="payspan">Rs.{state.amount_due}</span>
                    </div>
                    <div className="paysubmit">
                        <button className="payformbtn" onClick={handleClick}>{!loading ? <span>Pay</span> : <div className="loader"></div>}</button>
                    </div>
                </div>
            </div>}
        </div>
    )
}
export default Payment