import React, { useContext, useEffect, useState } from "react";
import FlatItem from "./FlatItem";
import userContext from "../Login/userContext";
const AdminHome = () => {
    const flatsInitial = []
    const [flats, setflats] = useState(flatsInitial)
    const context = useContext(userContext)
    const {userData} = context
    const fetchusers = async () => {
        const response = await fetch("http://localhost:4444/api/admin/getflatowners", {
            method: 'GET',
            headers: {
                'auth-token': localStorage.getItem('token')
            },
        });
        const json = await response.json()
        setflats(json)
    }
    useEffect(() => {
        if (localStorage.getItem('admin')) {
            fetchusers()
        }
    },)
    return (
        <div className="admin-main">
            <h1 className="head">Home Page</h1>
            <h2 className="head2">{userData.society_name} All Flats</h2>
            <div >
                {flats.length===0 && 'No flats added'}
                </div>
                {flats.map((flat) => {
                    return <FlatItem key={flat._id} flat={flat} />
                })}
        </div>
    )
}
export default AdminHome