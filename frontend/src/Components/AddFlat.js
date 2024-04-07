import React, { useContext, useRef, useState } from "react";
import { PopupContext } from "../App";
import userContext from "./Login/userContext";
const AddFlat = () => {
    const [flat, setFlat] = useState({ flat_owner_name: "", flat_no: "", amount_due: "", last_paid: "", password: "" })
    const [error, setError] = useState({})
    const alert = useContext(PopupContext);
    const { showPopup } = alert
    const ref = useRef(null)    // invisible modal close button
    const [loading, setloading] = useState(false)   // set loader
    const [showpass, setshowpass] = useState("password") // show/hide password
    const context = useContext(userContext)
    const {fetchusers} = context        // get list of flatowners in admin's society
    const handleClick = async (e) => {
        setloading(true)
        e.preventDefault()
        validate()
        const response = await fetch('http://localhost:4444/api/admin/addflatowner', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({
                flat_owner_name: flat.flat_owner_name, flat_no: flat.flat_no, amount_due: parseInt(flat.amount_due),
                last_paid: new Date(flat.last_paid), password: flat.password
            })
        });
        const json = await response.json()
        if (json.success) {
            ref.current.click()
            setFlat({ flat_owner_name: "", flat_no: "", amount_due: "", last_paid: "", password: "" })
            showPopup("Record added successfully", "success")
            fetchusers()
        }
        else if (json.error) {
            showPopup(json.error, "danger")
        }
        setloading(false)
    }
    const onChange = (e) => {
        setFlat({ ...flat, [e.target.name]: e.target.value })
    }
    const validate = () => {
        const errors = {}
        if (!flat.flat_owner_name) {
            errors.flat_owner_name = "Flat Owner Name is required!!"
        }
        if (!flat.flat_no) {
            errors.flat_no = "Flat no is required!!"
        }
        if (!flat.amount_due) {
            errors.amount_due = "Amount Due is required!!"
        }
        if (!flat.last_paid) {
            errors.last_paid = "Last Paid Date is required!!"
        }
        if (!flat.password) {
            errors.password = "Password is required!!"
        }
        setError(errors)
    }
    const txt1 = (e) => {
        setshowpass("text")
    }
    const pass1 = (e) => {
        setshowpass("password")
    }
    return (
        <div>
            <div className="modal fade" id="exampleModal2" tabIndex="-1" aria-labelledby="exampleModal2Label" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered w-25 h-50">
                    <div className="modal-content h-100">
                        <div className="modal-header cp-head">
                            <h1 className="modal-title fs-4" id="exampleModal2Label">Add Flat</h1>
                            <i type="button" data-bs-dismiss="modal" aria-label="Close" className="fa-solid fa-xmark fa-2xl" ref={ref} ></i>
                        </div>
                        <div className="modal-body">
                            <div className="addflatform">
                                <div className="login-field">
                                    <label className="society-label">FLAT OWNER NAME :- (Dr/Mr/Mrs. Firstname Lastname)</label>
                                    <div>
                                        <input type="text" className="loginput" name="flat_owner_name" placeholder="Enter Flat Owner Name" onChange={onChange} value={flat.flat_owner_name} />
                                    </div>
                                    <div className="error-field">{error.flat_owner_name}</div>
                                </div>
                                <div className="login-field">
                                    <label className="society-label">FLAT NO :- (eg: A-401)</label>
                                    <div>
                                        <input type="text" className="loginput" name="flat_no" placeholder="Enter Flat No" onChange={onChange} value={flat.flat_no} />
                                    </div>
                                    <div className="error-field">{error.flat_no}</div>
                                </div>
                                <div className="login-field">
                                    <label className="society-label">MAINTENANCE AMOUNT DUE </label>
                                    <div>
                                        <input type="text" className="loginput" name="amount_due" placeholder="Enter amount due in Rs." onChange={onChange} value={flat.amount_due} />
                                    </div>
                                    <div className="error-field">{error.amount_due}</div>
                                </div>
                                <div className="login-field">
                                    <label className="society-label">LAST PAID DATE</label>
                                    <div>
                                        <input type="date" className="loginput" name="last_paid" placeholder="Flat No" onChange={onChange} value={flat.last_paid} />
                                    </div>
                                    <div className="error-field">{error.last_paid}</div>
                                </div>
                                <div className="login-field">
                                    <label className="society-label">PASSWORD (should be same as flat no)</label>
                                    <div className="addpass">
                                        <input type={showpass} className="loginput" name="password" placeholder={error.password} onChange={onChange} value={flat.password} />
                                        <i className="fa-solid fa-eye fa-xs" type="button" onMouseOver={txt1} onMouseOut={pass1}></i>
                                    </div>
                                    <div className="error-field">{error.password}</div>
                                </div>
                                <button className="login-btn" onClick={handleClick}>{!loading ? "Add" : <div className="loader"></div>}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AddFlat