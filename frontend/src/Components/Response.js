import React, { useEffect, useState } from "react";
const Response = () => {
    const [payinfo, setpayinfo] = useState({})
    useEffect(() => {
        const fetchdata = async () => {
            const response = await fetch("http://localhost:4444/api/payment/payinfo", {
                method: 'GET',
            });
            const json = await response.json()
            console.log(json)
            setpayinfo(json)
        }
        fetchdata()
    }, [])
    return (
        <div >
            this is response page
            {payinfo.flat_no}
        </div>
    )
}
export default Response