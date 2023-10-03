import React, { useEffect, useState } from "react";
import './CSS/home.css'
import NoHome from "./HomePage/NoHome";
import AdminHome from "./HomePage/AdminHome";
import UserHome from "./HomePage/UserHome";
const Home = ()=>{
    const [link,setlink] = useState(0);
    useEffect(()=>{
        if (localStorage.getItem('token')) {
            if (localStorage.getItem('admin')) {
                setlink(1)
            }
            else {
                setlink(2)
            }
        }
        else {
            setlink(0)
        }
    })
    return(
        <div className="home-page">
            {link===0 && <NoHome />}
            {link===1 && <AdminHome />}
            {link===2 && <UserHome />}
        </div>
    )
}
export default Home