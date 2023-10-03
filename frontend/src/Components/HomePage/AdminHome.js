import React, { useEffect, useState } from "react";
const AdminHome = () => {
    const flatsInitial = []
    const [flats, setflats] = useState(flatsInitial)
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
    }, [])
    return (
        <div className="admin-main">
            <h1 className="head">Home Page</h1>
            <h2 className="head2">Aarav Society All Flats</h2>
            <div >
                {flats.length===0 && 'No flats added'}
                </div>
                {flats.map((flat) => {
                    return <div key={flat._id}>{ flat.flat_no }</div>
                })}
        </div>
    )
}
export default AdminHome