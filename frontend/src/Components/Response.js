import React, { useContext, useEffect, useRef, useState } from "react";
import { PopupContext } from "../App";
import "./CSS/response.css"
import { useNavigate } from "react-router-dom";
import userContext from "./Login/userContext";
const Response = () => {
    const [payinfo, setpayinfo] = useState({})
    const ref = useRef(null)
    const alert = useContext(PopupContext)
    const navigate = useNavigate()
    const context = useContext(userContext)
    const { getflatowner } = context
    const { showPopup } = alert
    const fetchdata = async (e) => {
        const response = await fetch("http://localhost:4444/api/payment/payinfo", {
            method: 'GET',
        });
        const json = await response.json()
        if (json.success) {
            setpayinfo(json.transaction)
            showPopup("Transaction is Successful", "success")
        }
    }
    useEffect(() => {
        if (localStorage.getItem("admin")) {
            navigate("/")
        }
        else {
            ref.current.click()
            getflatowner()
        }
    }, [])
    return (
        <div className="responsepage">
            <button type="button" className="d-none" ref={ref} onClick={fetchdata}></button>
            {payinfo.transaction_id ? <div className="successresp">
                <i className="fa-regular fa-circle-check fa-10x paysuc"></i>
                <table className="payreciept">
                    <tbody>
                        <tr>
                            <td colspan="2">Payment Platform : EaseBuzz</td>
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
                            <td>{payinfo.transaction_date}</td>
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