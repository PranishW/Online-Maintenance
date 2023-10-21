import React, { useContext, useRef, useState } from "react";
import { PopupContext } from "../../App";
import { useNavigate } from "react-router-dom";
const UserLogin = () => {
    const [user, setUser] = useState({ society_name: "", flat_no: "", password: "" })
    const [error, setError] = useState({})
    const alert = useContext(PopupContext);
    const { showPopup } = alert
    const ref = useRef(null)
    const [loading,setloading] = useState(false)
    const navigate = useNavigate();
    const handleClick = async (e) => {
        setloading(true)
        e.preventDefault()
        validate()
        const response = await fetch('http://localhost:4444/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        const json = await response.json()
        if (json.success) {
            // Save the auth token and redirect
            localStorage.setItem('token', json.authtoken)
            ref.current.click()
            navigate("/")
            showPopup("Logged in successfully", "success")
            setUser({ society_name: "", flat_no: "", password: "" })
        }
        else if (json.error) {
            showPopup(json.error, "danger")
        }
        setloading(false)
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
        if (!user.password) {
            errors.password = "Password is required!!"
        }
        setError(errors)
    }
    return (
        <div className="loginbody">
            <i className="user-ico fa-regular fa-circle-user fa-4x"></i>
            <div className="loginform">
                <div className="login-field">
                    <label className="society-label">SOCIETY/APARTMENT NAME</label>
                    <div>
                        <input type="text" className="loginput" name="society_name" placeholder="Society Name" onChange={onChange} value={user.society_name}/>
                    </div>
                    <div className="error-field">{error.society_name}</div>
                </div>
                <div className="login-field">
                    <label className="society-label">FLAT NO</label>
                    <div>
                        <input type="text" className="loginput" name="flat_no" placeholder="Flat No" onChange={onChange} value={user.flat_no}/>
                    </div>
                    <div className="error-field">{error.flat_no}</div>
                </div>
                <div className="login-field">
                    <label className="society-label">PASSWORD</label>
                    <div>
                        <input type="password" className="loginput" name="password" placeholder="Password" onChange={onChange} value={user.password}/>
                    </div>
                    <div className="error-field">{error.password}</div>
                </div>
                <button className="login-btn" onClick={handleClick}>{!loading?"Login":<div className="loader"></div>}</button>
            </div>
            <button type="button" className="btn-close d-none" data-bs-dismiss="modal" aria-label="Close" ref={ref}></button>
        </div>
    )
}
export default UserLogin