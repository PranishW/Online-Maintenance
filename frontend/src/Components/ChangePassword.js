import React, { useContext, useRef, useState } from "react";
import './CSS/changepass.css';
import { PopupContext } from "../App";
const ChangePassword = () => {
    const [data, setdata] = useState({ password: "", cpassword: "" })
    const [error, setError] = useState({ password: "Enter New Password", cpassword: "Confirm New Password" })
    const host = "https://online-maintenance.onrender.com"
    const alert = useContext(PopupContext)
    const { showPopup } = alert
    const [showpass, setshowpass] = useState("password") // hide/show password field value
    const [showcpass, setshowcpass] = useState("password")  // hide/show confirm password field value
    const ref = useRef(null)       // invisible close button to close modal
    const [loading,setloading] = useState(false)    // set loader
    const handleClick = async (e) => {
        setloading(true)
        validate()
        if (data.password !== data.cpassword) {
            showPopup("Password in both fields does not match", "warning")
        }
        else {
            if (localStorage.getItem('admin')) {
                const response = await fetch(`${host}/api/admin/editadminpassword`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('token')
                    },
                    body: JSON.stringify({ password: data.password })
                });     // change admin password
                const json = await response.json()
                if (json.success) {
                    ref.current.click()
                    setdata({ password: "", cpassword: "" })
                    setError({ password: "Enter New Password", cpassword: "Confirm New Password" })
                    showPopup("Password Changed successfully", "success")
                }
                else if (json.error) {
                    showPopup(json.error, "danger")
                }
            }
            else {
                const response = await fetch(`${host}/api/user/changepassword`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('token')
                    },
                    body: JSON.stringify({ password: data.password })
                });     // change flatowner password
                const json = await response.json()
                if (json.success) {
                    ref.current.click()
                    setdata({ password: "", cpassword: "" })
                    setError({ password: "Enter New Password", cpassword: "Confirm New Password" })
                    showPopup("Password Changed successfully", "success")
                }
                else if (json.error) {
                    showPopup(json.error, "danger")
                }
            }
        }
        setloading(false)
    }
    const onChange = (e) => {
        setdata({ ...data, [e.target.name]: e.target.value })
    }
    const validate = () => {
        const errors = {}
        if (!data.password) {
            errors.password = "This field is required!!!"
        }
        if (!data.cpassword) {
            errors.cpassword = "This field is required!!!"
        }
        setError(errors)
    }
    // below 4 functions to show/hide password field values
    const txt1 = (e) => {
        setshowpass("text")
    }
    const pass1 = (e) => {
        setshowpass("password")
    }
    const txt2 = (e) => {
        setshowcpass("text")
    }
    const pass2 = (e) => {
        setshowcpass("password")
    }
    return (
        <div>
            <div className="modal fade" id="exampleModal1" tabIndex="-1" aria-labelledby="exampleModal1Label" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered cpmodal">
                    <div className="modal-content cp-main">
                        <div className="modal-header cp-head">
                            <h1 className="modal-title fs-4" id="exampleModal1Label">Change Password</h1>
                            <i type="button" data-bs-dismiss="modal" aria-label="Close" className="fa-solid fa-xmark fa-2xl" ref={ref} ></i>
                        </div>
                        <div className="modal-body cp-body">
                            <div>
                                <p className="pass-res">New Password must contain atleast 8 characters</p>
                                <p className="pass-res">must contain atleast one Uppercase Letter (A-Z)</p>
                                <p className="pass-res">must contain atleast one digit (0-9)</p>
                                <p className="pass-res">must contain atleast one symbol (@#$%&)</p>
                            </div>
                            <div className="pass">
                                <label className="society-label">New Password</label>
                                <div className="cpinput">
                                    <input type={showpass} className="loginput" name="password" placeholder={error.password} onChange={onChange} value={data.password} />
                                    <i className="fa-solid fa-eye fa-xs" type="button" onMouseOver={txt1} onMouseOut={pass1}></i>
                                </div>
                            </div>
                            <div className="pass cpass">
                                <label className="society-label">New Password</label>
                                <div className="cpinput">
                                    <input type={showcpass} className="loginput" name="cpassword" placeholder={error.cpassword} onChange={onChange} value={data.cpassword} />
                                    <i className="fa-solid fa-eye fa-xs" type="button" onMouseOver={txt2} onMouseOut={pass2}></i>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer cp-foot">
                            <button type="button" className="btn cp-save" onClick={handleClick} >{!loading?"Save changes":<div className="loader"></div>}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ChangePassword