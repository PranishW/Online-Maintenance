import React, { useState } from "react";
import './CSS/loginportal.css'
import { Link } from "react-router-dom";
import UserLogin from "./Login/UserLogin";
import AdminLogin from "./Login/AdminLogin";
const LoginPortal = () => {
    const [setActive, ActiveLink] = useState(true)
    return (
        <div className="logportal">
            <div className="modal fade " id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                <div className="modal-dialog modal-dialog-centered loginmodal">
                    <div className="modal-content loginportal">
                        <div className="modal-body">
                            <div className="logtop">
                                <div className={`logbtn ${setActive ? "active" : ""}`} onClick={() => { ActiveLink(true) }}>
                                    <Link className={`log-link ${setActive ? "active" : ""}`}>User Login</Link>
                                </div>
                                <div className={`logbtn ${!setActive ? "active" : ""}`} onClick={() => { ActiveLink(false) }}>
                                    <Link className={`log-link ${!setActive ? "active" : ""}`}>Admin Login</Link>
                                </div>
                            </div>
                            {setActive ? <UserLogin /> : <AdminLogin />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default LoginPortal