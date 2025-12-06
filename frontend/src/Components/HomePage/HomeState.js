import { useState } from "react";
import HomeContext from "./HomeContext";

const HomeState = ({ children }) => {
    // props - the child components using the context, is destructured and {children(each separate child component) are extracted and provided with context
    const [soclist,setsoclist] = useState([]);
    const getsocieties = async () => {
        const response = await fetch('https://online-maintenance.onrender.com/api/admin/societies', {
            method: 'GET'
        })
        const societies = await response.json();
        setsoclist(societies);
    }
    const getflatsList = async (society_name) => {
        const response = await fetch(`https://online-maintenance.onrender.com/api/user/getflats/${society_name}`, {
            method: 'GET'
        })
        const flats = await response.json()
        return flats;
    }
    return (
        <HomeContext.Provider value={{getsocieties,getflatsList,soclist }}>
            {children}
        </HomeContext.Provider>
    )
}

export default HomeState;