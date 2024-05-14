import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './CSS/navbar.css'
import LoginPortal from "./LoginPortal";
import userContext from "./Login/userContext";
import { PopupContext } from "../App";
import ChangePassword from "./ChangePassword";
import AddFlat from "./AddFlat";
import UserProfile from "./userProfile";
import AdminProfile from "./AdminProfile";
import TransactionModal from "./Transactions/TransactionModal";
import TransactionContext from "./Transactions/TransactionContext";
const Navbar = () => {
    const alert = useContext(PopupContext)
    const { showPopup } = alert
    const context = useContext(userContext);
    const [link, setlink] = useState(0);
    const { userData, getflatowner, getadmin } = context  // admin data,flatowner data
    const navigate = useNavigate()
    const transcontext = useContext(TransactionContext)
    const { getalltransactions, gettransactions } = transcontext    // get list of transactions
    const viewalltransactions = (e) =>{
        getalltransactions()
    }
    const viewtransactions = (e) =>{
        gettransactions()
    }
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        navigate("/")
        showPopup("Logged out", "primary")
    }
    useEffect(() => {
        if (localStorage.getItem('token')) {
            if (localStorage.getItem('admin')) {
                getadmin()
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
    }, [localStorage.getItem('token'), localStorage.getItem('admin')])
    return (
        <div className="navbar">
            <div className="logo">
                <i className="navlogo fa-solid fa-screwdriver-wrench" ></i>
                <h1 className="nav-head">Monthly Maintenance Portal</h1>
            </div>
            <div className="navbuttons">
                <Link className="nav-btn" to="/"><i className="navic fa-solid fa-house" /><span className="icon-name">Home</span></Link>
                {link === 0 && <Link type="button" className="nav-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <i className="navic fa-solid fa-right-to-bracket" /><span className="icon-name">Login</span>
                </Link>}
                {link === 1 && <div className="dropdown">
                    <Link className="dropdown-toggle nav-dpd" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {userData.admin_name ? userData.admin_name.substring(0, userData.admin_name.indexOf(" ")) : " "}
                    </Link>
                    <ul className="dropdown-menu">
                        <li><Link type="button" className="dropdown-item profile" data-bs-toggle="modal" data-bs-target="#exampleModal4">Profile</Link></li>
                        <li><Link type="button" className="dropdown-item cp" data-bs-toggle="modal" data-bs-target="#exampleModal1" >Change Password</Link></li>
                        <li><Link type="button" className="dropdown-item au" data-bs-toggle="modal" data-bs-target="#exampleModal2" >Add Flat</Link></li>
                        <li><Link type="button" className="dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModal5" onClick={viewalltransactions}>
                            View All Transactions
                        </Link></li>
                        <li><button onClick={handleLogout} className="dropdown-item logout" >Logout</button></li>
                    </ul>
                </div>}
                {link === 2 && <div className="dropdown">
                    <Link className="dropdown-toggle nav-dpd" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {userData.flat_no}
                    </Link>

                    <ul className="dropdown-menu">
                        <li><Link type="button" className="dropdown-item profile" data-bs-toggle="modal" data-bs-target="#exampleModal3" >Profile</Link></li>
                        <li><Link type="button" className="dropdown-item cp" data-bs-toggle="modal" data-bs-target="#exampleModal1" >Change Password</Link></li>
                        <li><Link type="button" className="dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModal5" onClick={viewtransactions}>
                            View Transactions
                        </Link></li>
                        <li><button onClick={handleLogout} className="dropdown-item logout" >Logout</button></li>
                    </ul>
                </div>}
            </div>
            <LoginPortal />
            <ChangePassword />
            <AddFlat />
            <UserProfile />
            <AdminProfile />
            <TransactionModal />
        </div>
    )
}
export default Navbar