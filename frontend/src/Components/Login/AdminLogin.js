import React, { useContext, useEffect, useRef, useState } from "react";
import userContext from "./userContext";
import { PopupContext } from "../../App";
const AdminLogin = ()=>{
    const [admin,setAdmin] = useState({society_name:"",password:""})
    const [error, setError] = useState({})
    const alert = useContext(PopupContext);
    const { showPopup } = alert
    const ref = useRef(null)
    const context = useContext(userContext)
    const {userData,getadmin} = context
    const handleClick = async (e) =>{
        e.preventDefault()
        validate()
        const response = await fetch('http://localhost:4444/api/admin/adminlogin',{
            method : 'POST',
            headers :{
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(admin)
        });
        const json = await response.json()
        if(json.success)
        {
            // Save the auth token and redirect
            localStorage.setItem('token', json.authtoken)
            ref.current.click()
            getadmin()
        }
        else if(json.error){
            showPopup(json.error, "danger")
        }
    }
    const onChange = (e) =>{
        setAdmin({...admin,[e.target.name]: e.target.value})
    }
    const validate = () => {
        const errors = {}
        if (!admin.society_name) {
            errors.society_name = "Society Name is required!!"
            console.log(error)
        }
        if (!admin.password) {
            errors.password = "Password is required!!"
        }
        setError(errors)
    }
    useEffect(() => {
        if (localStorage.getItem('token')) {
            showPopup(`${userData.admin_name} logged in successfully`, "success")
        }
    },[localStorage.getItem('token')])
    return(
        <div className="loginbody">
            <i className="user-ico fa-solid fa-lock fa-4x"></i>
            <div className="loginform">
                <div className="login-field">
                    <label className="society-label">SOCIETY NAME</label>
                    <div>
                        <input type="text" className="loginput" name="society_name" placeholder="Society Name" onChange={onChange}/>
                    </div>
                    <div className="error-field">{error.society_name}</div>
                </div>
                <div className="login-field">
                    <label className="society-label">PASSWORD</label>
                    <div>
                        <input type="password" className="loginput" name="password" placeholder="Password" onChange={onChange}/>
                    </div>
                    <div className="error-field">{error.password}</div>
                </div>
                <button  className="login-btn" onClick={handleClick}>Login</button>
            </div>
            <button type="button" className="btn-close d-none" data-bs-dismiss="modal" aria-label="Close" ref={ref}></button>
        </div>
    )
}
export default AdminLogin