import React, { useEffect } from "react";
import { Link,useLocation, useNavigate } from "react-router-dom";
import "./CSS/payment.css";
const Payment = () => {
    const { state } = useLocation()
    const navigate = useNavigate()
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
                            <label className="home-label">Email</label>
                            <div>
                                <input type="email" className="payinput" placeholder="Enter email" name="email" ></input>
                                <div className="error-field">This Field is Required</div>
                            </div>
                        </div>
                        <div className="field1">
                            <label className="home-label">Phone No</label>
                            <div>
                                <input type="tel" className="payinput" placeholder="Enter phone no" name="phone" ></input>
                                <div className="error-field">This Field is Required</div>
                            </div>
                        </div>
                    </div>
                    <div className="payamt">
                        Maintenance Amount : <span className="payspan">Rs.{state.amount_due}</span>
                    </div>
                    <div className="paysubmit">
                        <button className="payformbtn">Pay</button>
                    </div>
                </div>
            </div>}
        </div>
    )
}
export default Payment