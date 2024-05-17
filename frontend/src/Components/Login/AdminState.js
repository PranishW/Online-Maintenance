import { useState } from "react";
import userContext from "./userContext";

const AdminState = (props) => {
    const host = "https://online-maintenance.onrender.com"
    const logInit = { success: true, error: "Fill every field to login" }
    const [userData, setUserData] = useState(logInit)  // data of flatowner/admin
    const flatsInitial = []
    const [flats, setflats] = useState(flatsInitial)   // list of all flatowners
    // get flat owner data
    const getflatowner = async () => {
        const response = await fetch(`${host}/api/user/getuser`, {
            method: 'GET',
            headers: {
                'auth-token': localStorage.getItem('token')
            },
        });
        const json = await response.json()
        setUserData(json);
    }
    // get admin data
    const getadmin = async () => {
        const response = await fetch(`${host}/api/admin/getadmin`, {
            method: 'GET',
            headers: {
                'auth-token': localStorage.getItem('token')
            },
        });
        const json = await response.json()
        setUserData(json);
    }
    // get all society flatowners list
    const fetchusers = async () => {
        const response = await fetch(`${host}/api/admin/getflatowners`, {
            method: 'GET',
            headers: {
                'auth-token': localStorage.getItem('token')
            },
        });
        const json = await response.json()
        setflats(json)
    }
    return (
        <userContext.Provider value={{ userData, getflatowner, getadmin,flats,fetchusers }}>
            {props.children}
        </userContext.Provider>
    )
}

export default AdminState;