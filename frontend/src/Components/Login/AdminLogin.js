import React, { useContext, useRef, useState } from "react";
import { PopupContext } from "../../App";
const AdminLogin = () => {
    const [admin, setAdmin] = useState({ society_name: "", password: "" })
    const [error, setError] = useState({})
    const alert = useContext(PopupContext);
    const { showPopup } = alert
    const ref = useRef(null)
    const [loading,setloading] = useState(false)
    const handleClick = async (e) => {
        setloading(true)
        e.preventDefault()
        validate()
        const response = await fetch('http://localhost:4444/api/admin/adminlogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(admin)
        });
        const json = await response.json()
        if (json.success) {
            // Save the auth token and redirect
            localStorage.setItem('token', json.authtoken)
            localStorage.setItem('admin',json.authtoken+makeid(5))
            ref.current.click()
            showPopup("Logged in successfully", "success")
            setAdmin({ society_name: "", password: "" })
        }
        else if (json.error) {
            showPopup(json.error, "danger")
        }
        setloading(false)
    }
    const onChange = (e) => {
        setAdmin({ ...admin, [e.target.name]: e.target.value })
    }
    const validate = () => {
        const errors = {}
        if (!admin.society_name) {
            errors.society_name = "Society Name is required!!"
        }
        if (!admin.password) {
            errors.password = "Password is required!!"
        }
        setError(errors)
    }
    const makeid = (length) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }
    return (
        <div className="loginbody">
            <i className="user-ico fa-solid fa-lock fa-4x"></i>
            <div className="loginform">
                <div className="login-field">
                    <label className="society-label">SOCIETY/APARTMENT NAME</label>
                    <div>
                        <input type="text" className="loginput" name="society_name" placeholder="Society Name" onChange={onChange} value={admin.society_name}/>
                    </div>
                    <div className="error-field">{error.society_name}</div>
                </div>
                <div className="login-field">
                    <label className="society-label">PASSWORD</label>
                    <div>
                        <input type="password" className="loginput" name="password" placeholder="Password" onChange={onChange} value={admin.password}/>
                    </div>
                    <div className="error-field">{error.password}</div>
                </div>
                <button className="login-btn" onClick={handleClick}>{!loading?"Login":<div className="loader"></div>}</button>
            </div>
            <button type="button" className="btn-close d-none" data-bs-dismiss="modal" aria-label="Close" ref={ref}></button>
        </div>
    )
}
export default AdminLogin