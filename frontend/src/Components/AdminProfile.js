import React, { useContext,useRef, useState } from "react";
import userContext from "./Login/userContext";
import { PopupContext } from "../App";
const AdminProfile = () => {
    const ref = useRef(null)    // invisible modal close button
    const [loading, setloading] = useState(false)   // set loader
    const context = useContext(userContext)
    const { userData, getadmin } = context
    const [formdata, setformdata] = useState({})  // form data from client side
    const [btn, setbtn] = useState(false) // set update button
    const [no, editno] = useState(false)    // edit phone no button
    const [name, editname] = useState(false)    // edit name button
    const [pmm, editpmm] = useState(false)  // edit per month maintenance amount button
    const alert = useContext(PopupContext)
    const { showPopup } = alert
    const handleClick = async (e) => {
        setloading(true)
        if(formdata.per_month_maintenance) {
            parseInt(formdata.per_month_maintenance)        // convert string input value into Integer
        }
        const response = await fetch("https://online-maintenance.onrender.com/api/admin/editadmin", {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify(formdata)
        });
        const json = await response.json()
        if (json.success) {
            ref.current.click()
            showPopup("Profile Updated successfully", "success")
            setbtn(false)
            editname(false)
            editno(false)
            editpmm(false)
            setformdata({})
            getadmin()
        }
        else if (json.error) {
            showPopup(json.error, "danger")
        }
        setloading(false)
    }
    const handlename = (e) => {
        editname(true)
    }
    const handleno = (e) => {
        editno(true)
    }
    const handlepmm = (e) =>{
        editpmm(true)
    }
    const onChange = (e) => {
        setformdata({ ...formdata, [e.target.name]: e.target.value })
        setbtn(true)
    }
    // reset to original admin data after clicking reset button
    const resetvalues = (e) => {
        editname(false)
        editno(false)
        setbtn(false)
        editpmm(false)
    }
    return (
        <div>
            <div className="modal fade" id="exampleModal4" tabIndex="-1" aria-labelledby="exampleModal4Label" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered profilemodal">
                    <div className="modal-content profileportal">
                        <div className="modal-header cp-head">
                            <h1 className="modal-title fs-4" id="exampleModal4Label">Profile Page</h1>
                            <i type="button" data-bs-dismiss="modal" aria-label="Close" className="fa-solid fa-xmark fa-2xl" ref={ref} onClick={resetvalues}></i>
                        </div>
                        <div className="modal-body ">
                            <div className="profiledata">
                                <div className="divred">Click on <i className="fa-solid fa-pen-to-square"></i> to update corresponding field</div>
                                <div className="login-field">
                                    <label className="society-label">FLAT OWNER NAME <i type="button" className="fa-solid fa-pen-to-square" onClick={handlename}></i></label>
                                    <div>
                                        <input type="text" className="loginput" name="admin_name" disabled={!name}
                                            value={name ? formdata.admin_name : userData.admin_name} onChange={onChange} />
                                    </div>
                                </div>
                                <div className="login-field">
                                    <label className="society-label">PHONE NO. <i type="button" className="fa-solid fa-pen-to-square" onClick={handleno}></i></label>
                                    <input type="tel" className="profdis" name="mob_no" disabled={!no}
                                        value={no ? formdata.mob_no : userData.mob_no} onChange={onChange} />
                                    <i className="fa-solid fa-phone"></i>
                                </div>
                                <div className="login-field">
                                    <label className="society-label">Per Month Maintenance (Rs.) <i type="button" className="fa-solid fa-pen-to-square" onClick={handlepmm}></i></label>
                                    <input type="text" className="profdis" name="per_month_maintenance" disabled={!pmm}
                                        value={pmm ? formdata.per_month_maintenance : userData.per_month_maintenance} onChange={onChange} />
                                </div>
                                <div className="login-field">
                                    <label className="society-label">SOCIETY NAME</label>
                                    <input type="text" className="profdis" value={userData.society_name} />
                                </div>
                                {btn ? <div className="profbtns"><button className="login-btn" onClick={handleClick}>{!loading ? "Update Profile" : <div className="loader"></div>}</button>
                                    <button className="login-btn" onClick={resetvalues}>Reset Data</button></div> : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AdminProfile