import React, { useContext, useEffect, useRef, useState } from "react";
import userContext from "./Login/userContext";
import { PopupContext } from "../App";
const AdminProfile = () => {
    const ref = useRef(null)
    const [loading, setloading] = useState(false)
    const context = useContext(userContext)
    const { userData, getadmin } = context
    const [formdata, setformdata] = useState({})
    const [btn, setbtn] = useState(false)
    const [no, editno] = useState(false)
    const [name, editname] = useState(false)
    const [pmm, editpmm] = useState(false)
    const alert = useContext(PopupContext)
    const { showPopup } = alert
    const handleClick = async (e) => {
        setloading(true)
        if(formdata.per_month_maintenance) {
            parseInt(formdata.per_month_maintenance)
        }
        const response = await fetch("http://localhost:4444/api/admin/editadmin", {
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
    const resetvalues = (e) => {
        editname(false)
        editno(false)
        setbtn(false)
    }
    return (
        <div>
            <div className="modal fade" id="exampleModal4" tabIndex="-1" aria-labelledby="exampleModal4Label" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered w-25 h-50">
                    <div className="modal-content h-50">
                        <div className="modal-header cp-head">
                            <h1 className="modal-title fs-4" id="exampleModal4Label">Profile Page</h1>
                            <i type="button" data-bs-dismiss="modal" aria-label="Close" className="fa-solid fa-xmark fa-2xl" ref={ref} ></i>
                        </div>
                        <div className="modal-body ">
                            <div className="profiledata">
                                <div className="divred">Click on <i className="fa-solid fa-pen-to-square"></i> to update corresponding field</div>
                                <div className="login-field">
                                    <label className="society-label">FLAT OWNER NAME <i type="button" className="fa-solid fa-pen-to-square" onClick={handlename}></i></label>
                                    <div>
                                        <input type="text" className="loginput" name="admin_name"
                                            value={name ? formdata.admin_name : userData.admin_name} onChange={onChange} />
                                    </div>
                                </div>
                                <div className="login-field">
                                    <label className="society-label">PHONE NO. <i type="button" className="fa-solid fa-pen-to-square" onClick={handleno}></i></label>
                                    <input type="tel" className="profdis" name="mob_no"
                                        value={no ? formdata.mob_no : userData.mob_no} onChange={onChange} />
                                    <i className="fa-solid fa-phone"></i>
                                </div>
                                <div className="login-field">
                                    <label className="society-label">Per Month Maintenance (Rs.) <i type="button" className="fa-solid fa-pen-to-square" onClick={handlepmm}></i></label>
                                    <input type="text" className="profdis" name="per_month_maintenance"
                                        value={pmm ? formdata.per_month_maintenance : userData.per_month_maintenance} onChange={onChange} />
                                </div>
                                <div className="login-field">
                                    <label className="society-label">SOCIETY NAME</label>
                                    <input type="text" className="profdis" disabled value={userData.society_name} />
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