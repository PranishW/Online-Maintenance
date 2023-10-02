import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './CSS/navbar.css'
import LoginPortal from "./LoginPortal";
import userContext from "./Login/userContext";
import { PopupContext } from "../App";
const Navbar = () => {
    const alert = useContext(PopupContext)
    const {showPopup} = alert
    const context = useContext(userContext);
    const [link, setlink] = useState(0);
    const { isAdmin, userData,getflatowner,getadmin } = context
    const handleLogout = () => {
        localStorage.removeItem('token');
        showPopup("Logged out","primary")
    }
    useEffect(() => {
        if (localStorage.getItem('token')) {
            if (isAdmin) {
                getadmin();
                setlink(1)
            }
            else {
                getflatowner()
                setlink(2)
            }
        }
        else {
            setlink(0)
        }
    })
    return (
        <div className="navbar">
            <div className="logo">
                <i className="navlogo fa-solid fa-screwdriver-wrench fa-2xl" ></i>
                <h1 className="nav-head">Monthly Maintenance Portal</h1>
            </div>
            <div className="navbuttons">
                <Link className="nav-btn"><i className="navic fa-solid fa-house" />Home</Link>
                {link === 0 && <Link type="button" className="nav-btn" data-bs-toggle="modal" data-bs-target="#exampleModal" ><i className="navic fa-solid fa-right-to-bracket" />Login</Link>}
                {link === 1 && <div className="dropdown">
                    <a className="dropdown-toggle nav-dpd" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {userData.admin_name.substring(0,userData.admin_name.indexOf(" "))}
                    </a>

                    <ul class="dropdown-menu">
                        <li><a className="dropdown-item" >Action</a></li>
                        <li><a className="dropdown-item" >Another action</a></li>
                        <li><button onClick={handleLogout} className="dropdown-item logout" >Logout</button></li>
                    </ul>
                </div>}
                {link === 2 && <div className="dropdown">
                    <a className="dropdown-toggle nav-dpd"  role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {userData.flat_no}
                    </a>

                    <ul className="dropdown-menu">
                        <li><a className="dropdown-item" >Action</a></li>
                        <li><a className="dropdown-item" >Another action aaaaaaaaa</a></li>
                        <li><button onClick={handleLogout} className="dropdown-item logout" >Logout</button></li>
                    </ul>
                </div>}
            </div>
            <LoginPortal />
        </div>
    )
}
export default Navbar