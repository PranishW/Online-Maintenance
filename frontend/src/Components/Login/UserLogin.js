import React, { useContext, useEffect, useRef, useState } from "react";
import { PopupContext } from "../../App";
import { useNavigate } from "react-router-dom";
import HomeContext from "../HomePage/HomeContext";
const UserLogin = () => {
    const [user, setUser] = useState({ society_name: "", flat_no: "", password: "" })
    const [error, setError] = useState({})
    const alert = useContext(PopupContext);
    const { showPopup } = alert
    const ref = useRef(null)
    const [loading,setloading] = useState(false)
    const navigate = useNavigate();
    const context = useContext(HomeContext);
    const {getflatsList,soclist} = context;
    const [flats,setflats] = useState([]);
    const handleClick = async (e) => {
        setloading(true)
        e.preventDefault()
        validate()
        const response = await fetch('https://online-maintenance.onrender.com/api/user/login', {
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
        const getflats = async (society) =>{
            const json = await getflatsList(society);
            setflats(json);
        }
        useEffect(()=>{
            if(user.society_name!=='')
            {
                user.flat_no='';
                getflats(user.society_name);
            }
        },[user.society_name])
    return (
        <div className="loginbody">
            <i className="user-ico fa-regular fa-circle-user "></i>
            <div className="loginform">
                <div className="login-field">
                    <label className="society-label">SOCIETY/APARTMENT NAME</label>
                    <select name="society_name" className="loginput" onChange={onChange} value={user.society_name}>
                        <option value="" disabled selected>Select society/apartment name</option>
                        {
                            soclist.map((society) => {
                                return <option key={society._id} value={society.society_name}>{society.society_name}</option>
                            })
                        }
                    </select>
                    <div className="error-field">{error.society_name}</div>
                </div>
                <div className="login-field">
                    <label className="society-label">FLAT NO</label>
                    <select name="flat_no" className="loginput" onChange={onChange} value={user.flat_no}>
                        <option value="" disabled selected>Select Flat No</option>
                        {
                            flats.map((flat) => {
                                return <option key={flat._id} value={flat.flat_no}>{flat.flat_no}</option>
                            })
                        }
                    </select>
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