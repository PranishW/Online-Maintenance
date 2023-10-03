import React, { useEffect, useState } from "react";
const NoHome = () => {
    const [bal, setbal] = useState(false)
    const [res, setres] = useState({})
    const [error, setError] = useState({})
    const [user, setUser] = useState({ society_name: "", flat_owner_name: "", flat_no: "" })
    const handleClick = async (e) => {
        validate()
        const response = await fetch('http://localhost:4444/api/user/getmaintenance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        const json = await response.json()
        if (json.success) {
            setbal(true)
            const flatowner = json.flatowner
            setres({
                success: "Result Found", society_name: flatowner.society_name, flat_owner_name: flatowner.flat_owner_name,
                flat_no: flatowner.flat_no, amount_due: flatowner.amount_due, last_paid: flatowner.last_paid
            })
        }
        if (json.error) {
            setbal(true)
            setres({ error: "No results Found" })
        }
    }
    const handleReset = (e) => {
        setbal(false)
        setError({})
        setUser({ society_name: "", flat_owner_name: "", flat_no: "" })
    }
    const onChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }
    const validate = () => {
        const errors = {}
        if (!user.society_name) {
            errors.society_name = "Society Name is required!!"
        }
        if (!user.flat_no) {
            errors.flat_no = "Flat no is required!!"
        }
        if (!user.flat_owner_name) {
            errors.flat_owner_name = "Flat Owner/Tenant Name is required!!"
        }
        setError(errors)
    }
    return (
        <div className="main">
            <h1 className="head">Home Page</h1>
            <h2 className="head2">Check Due Maintenance</h2>
            <div className="main-body">
                <div className="homeform">
                    <label className="home-label">SOCIETY/APARTMENT NAME</label>
                    <div>
                        <input type="text" className="homeinput" placeholder="Enter society/apartment name" name="society_name" onChange={onChange} value={user.society_name}></input>
                        <div className="error-field">{error.society_name}</div>
                    </div>
                </div>
                <div className="homeform">
                    <label className="home-label">FLAT OWNER/TENANT NAME :- (Dr/Mr/Mrs. Firstname Lastname)</label>
                    <div>
                        <input type="text" className="homeinput" placeholder="Enter name" name="flat_owner_name" onChange={onChange} value={user.flat_owner_name}></input>
                        <div className="error-field">{error.flat_owner_name}</div>
                    </div>
                </div>
                <div className="homeform">
                    <label className="home-label">FLAT NO :- (eg: A-401)</label>
                    <div>
                        <input type="text" className="homeinput" placeholder="Enter flat no" name="flat_no" onChange={onChange} value={user.flat_no}></input>
                        <div className="error-field">{error.flat_no}</div>
                    </div>
                </div>
                <div className="nohome-btn">
                    <button onClick={handleClick} className="nohomebtn">Check <i className="fa-solid fa-magnifying-glass"></i></button>
                    <button onClick={handleReset} className="nohomebtn">Refresh <i className="fa-solid fa-arrows-rotate"></i></button>
                </div>
            </div>
            {bal ? <div className="res-body">{res.success ? <div>
                <h4 className="ghead">{res.success} <i className="fa-solid fa-check"></i></h4>
                <div className="res-info">
                    <div>Society/Apartment Name : {res.society_name}</div>
                    <div>Flat Owner/Tenant Name : {res.flat_owner_name}</div>
                    <div>Flat No : {res.flat_no}</div>
                    <div>Last Paid Date (YYYY-MM-DD) : {res.last_paid.substring(0, res.last_paid.indexOf('T'))}</div>
                    <div>Maintenance Amount Due : {res.amount_due !== 0 ? <span>
                        <b>Rs. {res.amount_due}</b><button className="paybtn">Pay Now</button>
                    </span> : <span>No Due Amount to Pay</span>}
                    </div>
                </div>
            </div> : <div>
                <h4 className="rhead">{res.error} <i className="fa-solid fa-xmark"></i></h4>
            </div>
            }</div> : <div className="res-body"></div>}
        </div>
    )
}
export default NoHome