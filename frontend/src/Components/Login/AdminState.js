import { useState } from "react";
import userContext from "./userContext";

const AdminState = (props) => {
    const host = "http://localhost:4444"
    const [isAdmin, setAdmin] = useState(false);
    const logInit = { success: true, error: "Fill every field to login" }
    const [userData, setUserData] = useState(logInit)
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
        setAdmin(false);
    }
    const getadmin = async () => {
        const response = await fetch(`${host}/api/admin/getadmin`, {
            method: 'GET',
            headers: {
                'auth-token': localStorage.getItem('token')
            },
        });
        const json = await response.json()
        setUserData(json);
        setAdmin(true);
    }
    return (
        <userContext.Provider value={{ isAdmin, userData, getflatowner, getadmin }}>
            {props.children}
        </userContext.Provider>
    )
}

export default AdminState;