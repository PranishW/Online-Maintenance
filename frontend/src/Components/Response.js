import React, { useContext, useEffect, useRef, useState } from "react";
import { PopupContext } from "../App";
import "./CSS/response.css"
const Response = () => {
    const [payinfo, setpayinfo] = useState({})
    const ref = useRef(null)
    const alert = useContext(PopupContext)
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
        ref.current.click()
    }, [])
    return (
        <div className="responsepage">
            <button type="button" className="d-none" ref={ref} onClick={fetchdata}></button>
            {payinfo.transaction_id ? <div>
                <div>{payinfo.transaction_id}</div>
                <div>{payinfo.transaction_mode}</div>
                <div>{payinfo.flat_no}</div>
                <div>{payinfo.easepayid}</div>
                <div>{payinfo.society_name}</div>
                <div>{payinfo.amount}</div>
                <div>{payinfo.flat_no}</div>
                <div>{payinfo.transaction_date}</div>
            </div> : <div>Transaction Failed/ Not Initiated, Please Try Again</div>}
        </div>
    )
}
export default Response