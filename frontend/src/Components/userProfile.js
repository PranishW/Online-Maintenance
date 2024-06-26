import React, { useContext, useRef, useState } from "react";
import userContext from "./Login/userContext";
import { PopupContext } from "../App";
const UserProfile = () => {
    const ref = useRef(null)
    const [loading, setloading] = useState(false)  // loader
    const context = useContext(userContext)         // global flatowner data
    const { userData,getflatowner } = context
    const [formdata, setformdata] = useState({})    // edited form data
    const [btn, setbtn] = useState(false)           // login button disabled if no update in user data
    const [no, editno] = useState(false)            // btn to allow user edit phone no field
    const [name, editname] = useState(false)        // btn to allow user edit name field
    const alert = useContext(PopupContext)
    const { showPopup } = alert
    const handleClick = async (e) => {
        setloading(true)
        const response = await fetch("https://online-maintenance.onrender.com/api/user/editdata", {
            method: 'PUT',
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
            getflatowner()
        }
        else if (json.error) {
            showPopup(json.error, "danger")
        }
        setloading(false)
    }
    // to handle change in name field
    const handlename = (e) => {
        editname(true)
    }
    // to handle change in phone no field
    const handleno = (e) => {
        editno(true)
    }
    const onChange = (e) => {
        setformdata({ ...formdata, [e.target.name]: e.target.value })
        setbtn(true)
    }
    // to remove changed and reset original user data
    const resetvalues = (e) => {
        editname(false)
        editno(false)
        setbtn(false)
    }
    return (
        <div>
            <div className="modal fade" id="exampleModal3" tabIndex="-1" aria-labelledby="exampleModal3Label" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered profilemodal">
                    <div className="modal-content profileportal">
                        <div className="modal-header cp-head">
                            <h1 className="modal-title fs-4" id="exampleModal3Label">Profile Page</h1>
                            <i type="button" data-bs-dismiss="modal" aria-label="Close" className="fa-solid fa-xmark fa-2xl" ref={ref} onClick={resetvalues}></i>
                        </div>
                        <div className="modal-body ">
                            <div className="profiledata">
                                <div className="divred">Click on <i className="fa-solid fa-pen-to-square"></i> to update corresponding field</div>
                                <div className="login-field">
                                    <label className="society-label">FLAT OWNER NAME <i type="button" className="fa-solid fa-pen-to-square" onClick={handlename}></i></label>
                                    <div>
                                        <input type="text" className="loginput" name="flat_owner_name" disabled={!name}
                                            value={name ? formdata.flat_owner_name : userData.flat_owner_name} onChange={onChange} />
                                    </div>
                                </div>
                                <div className="login-field">
                                    <label className="society-label">PHONE NO. <i type="button" className="fa-solid fa-pen-to-square" onClick={handleno}></i></label>
                                    <input type="tel" className="profdis" name="mob_no" disabled={!no}
                                        value={no ? formdata.mob_no : userData.mob_no?userData.mob_no:""} onChange={onChange} />
                                    <i className="fa-solid fa-phone"></i>
                                </div>
                                <div className="login-field">
                                    <label className="society-label">SOCIETY NAME</label>
                                    <input type="text" className="profdis" value={userData.society_name} />
                                </div>
                                <div className="login-field">
                                    <label className="society-label">FLAT NO</label>
                                    <input type="text" className="profdis" value={userData.flat_no} />
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
export default UserProfile