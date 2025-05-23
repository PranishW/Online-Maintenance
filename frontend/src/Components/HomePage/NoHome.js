import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"
const NoHome = () => {
    const [bal, setbal] = useState(false)   // show result obtained from server
    const [res, setres] = useState({})      // get flat owner due maintenance and other details 
    const [error, setError] = useState({})
    const [user, setUser] = useState({ society_name: "", flat_owner_name: "", flat_no: "" })    // set flatowner form data
    const [loading, setloading] = useState(false) // set loader
    const [soc, setsoc] = useState([]); // set societies
    const [flats, setflats] = useState([]); // set flats
    const handleClick = async (e) => {
        setloading(true)
        validate()
        const response = await fetch('https://online-maintenance.onrender.com/api/user/getmaintenance', {
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
                flat_no: flatowner.flat_no, amount_due: flatowner.amount_due, last_paid: new Date(flatowner.last_paid)
            })
        }
        if (json.error) {
            setbal(true)
            setres({ error: "No results Found" })
        }
        setloading(false)
    }
    const handleReset = (e) => {
        setbal(false)
        setError({})
        setUser({ society_name: "", flat_owner_name: "", flat_no: "" })
        setflats([])
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
        setError(errors)
    }
    const societies = async () => {
        const response = await fetch('https://online-maintenance.onrender.com/api/admin/societies', {
            method: 'GET'
        })
        const json = await response.json()
        setsoc(json)
    }
    const getflats = async() =>{
        console.log(user.society_name)
        const response = await fetch(`https://online-maintenance.onrender.com/api/user/getflats/${user.society_name}`,{
            method: 'GET'
        })
        const json = await response.json()
        setflats(json)
    }
    useEffect(() => {
        societies()
    }, [])
    return (
        <div className="main">
            <h1 className="head">Home Page</h1>
            <h2 className="head2">Check Due Maintenance</h2>
            <div className="main-body">
                <div className="homeform">
                    <label className="home-label">SOCIETY/APARTMENT NAME</label>
                    <div>
                        <select name="society_name" className="homeinput" onChange={onChange} value={user.society_name}>
                            <option value="" disabled selected>Select society/apartment name</option>
                            {
                                soc.map((society) => {
                                    return <option key={society._id} value={society.society_name}>{society.society_name}</option>
                                })
                            }
                        </select>
                        <div className="error-field">{error.society_name}</div>
                    </div>
                </div>
                <div className="homeform">
                    <label className="home-label">FLAT OWNER NAME</label>
                    <div>
                        <input type="text" className="homeinput" placeholder="Enter name" name="flat_owner_name" onChange={onChange} value={user.flat_owner_name}></input>
                        <div className="error-field">{error.flat_owner_name}</div>
                    </div>
                </div>
                <div className="homeform">
                    <label className="home-label">FLAT NO</label>
                    <div>
                        <select name="flat_no" className="homeinput" onChange={onChange} value={user.flat_no} onClick={getflats}>
                            <option value="" disabled selected>Select Flat No</option>
                            {
                                flats.map((flat) => {
                                    return <option key={flat._id} value={flat.flat_no}>{flat.flat_no}</option>
                                })
                            }
                        </select>
                        <div className="error-field">{error.flat_no}</div>
                    </div>
                </div>
                <div className="nohome-btn">
                    <button onClick={handleClick} className="nohomebtn">
                        {!loading ? <span>Check <i className="fa-solid fa-magnifying-glass"></i></span> : <div className="loader"></div>}
                    </button>
                    <button onClick={handleReset} className="nohomebtn">Refresh <i className="fa-solid fa-arrows-rotate"></i></button>
                </div>
            </div>
            {bal ? <div className="res-body">{res.success ? <div>
                <h4 className="ghead">{res.success} <i className="fa-solid fa-check"></i></h4>
                <div className="res-info">
                    <div>Society/Apartment Name : {res.society_name}</div>
                    <div>Flat Owner Name : {res.flat_owner_name}</div>
                    <div>Flat No : {res.flat_no}</div>
                    <div>Last Paid Date (DD-MM-YYYY) : {res.last_paid.getDate() + "-" + (res.last_paid.getMonth() + 1) + "-" + res.last_paid.getFullYear()}</div>
                    <div>Maintenance Amount Due : {res.amount_due !== 0 ? <span>
                        <b>Rs. {res.amount_due}</b><Link type="button" className="paybtn" to="/payment" state={res} >Pay Now</Link>
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