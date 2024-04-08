import React, { useContext, useEffect} from "react";
import FlatItem from "./FlatItem";
import userContext from "../Login/userContext";
const AdminHome = () => {
    const context = useContext(userContext)
    const { userData, flats, fetchusers } = context     // admin data, list of all flats, list of all flatowners in the society
    useEffect(() => {
        if (localStorage.getItem('admin')) {
            fetchusers()
        }
    }, [])
    return (
        <div className="admin-main">
            <h1 className="head">Home Page</h1>
            <h2 className="head2">{userData.society_name} All Flats</h2>
            <div>
                {flats.length === 0 && 'No flats added'}
            </div>
            {flats.map((flat) => {
                return <FlatItem key={flat._id} flat={flat} />
            })}
        </div>
    )
}
export default AdminHome