import { useState } from "react";
import userContext from "./userContext";

const AdminState = (props) => {
    const host = "http://localhost:4444"
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
    }
    return (
        <userContext.Provider value={{ userData, getflatowner, getadmin }}>
            {props.children}
        </userContext.Provider>
    )
}

export default AdminState;