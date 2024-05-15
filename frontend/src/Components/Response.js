import React, { useContext, useEffect, useState } from "react";
import { PopupContext } from "../App";
import "./CSS/response.css"
import { useNavigate } from "react-router-dom";
import userContext from "./Login/userContext";
const Response = () => {
    const [payinfo, setpayinfo] = useState({})  // set recent transaction data
    const [paydate,setpaydate] = useState(new Date());
    const alert = useContext(PopupContext)
    const navigate = useNavigate() // admin cannot access this page
    const context = useContext(userContext)    // global flatowner data
    const { getflatowner } = context
    const { showPopup } = alert
    const fetchdata = async (e) => {
        const response = await fetch("https://online-maintenance.onrender.com/api/payment/payinfo", {
            method: 'GET',
        });
        const json = await response.json()
        if (json.success) {
            setpayinfo(json.transaction)
            setpaydate(new Date(json.transaction.transaction_date))
            showPopup("Transaction is Successful", "success")
        }
    }
    useEffect(() => {
        if (localStorage.getItem("admin")) {
            navigate("/")
        }
        else {
            fetchdata()
            getflatowner()
        }
    }, [])
    return (
        <div className="responsepage">
            {payinfo.transaction_id ? <div className="successresp">
                <i className="fa-regular fa-circle-check paysuc"></i>
                <table className="payreciept">
                    <tbody>
                        <tr>
                            <td colSpan="2">Payment Platform : EaseBuzz</td>
                        </tr>
                        <tr>
                            <td>Transaction ID</td>
                            <td>{payinfo.transaction_id}</td>
                        </tr>
                        <tr>
                            <td>EasePay ID</td>
                            <td>{payinfo.easepayid}</td>
                        </tr>
                        <tr>
                            <td>Name</td>
                            <td>{payinfo.flat_owner_name}</td>
                        </tr>
                        <tr>
                            <td>Society Name</td>
                            <td>{payinfo.society_name}</td>
                        </tr>
                        <tr>
                            <td>Flat No. </td>
                            <td>{payinfo.flat_no}</td>
                        </tr>
                        <tr>
                            <td>Transaction Mode</td>
                            {payinfo.transaction_mode === "MW" && <td>Mobile Wallet</td>}
                            {payinfo.transaction_mode === "CC" && <td>Debit/Credit Card</td>}
                            {payinfo.transaction_mode === "NB" && <td>Net Banking</td>}
                            {payinfo.transaction_mode === "UPI" && <td>UPI</td>}
                        </tr>
                        {payinfo.transaction_mode === "NB" && <tr>
                            <td>Bank Name : </td>
                            <td>{payinfo.bank_name}</td>
                        </tr>}
                        <tr>
                            <td>Transaction Date</td>
                            <td>{paydate.getUTCDate()+"-"+(paydate.getUTCMonth()+1)+"-"+paydate.getUTCFullYear()}</td>
                        </tr>
                        <tr>
                            <td>Status</td>
                            <td>Success</td>
                        </tr>
                        <tr>
                            <td>Amount Paid</td>
                            <td>Rs.{payinfo.amount}</td>
                        </tr>
                    </tbody>
                </table>
            </div> : <div className="failresp">
                <i className="fa-solid fa-triangle-exclamation fa-6x"></i>
                <div>
                    Transaction Failed/ Not Initiated/ Cancelled, Please Try Again !
                </div>
            </div>}
        </div>
    )
}
export default Response