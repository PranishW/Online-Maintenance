import { useState } from "react";
import TransactionContext from "./TransactionContext";

const TransactionState = (props) =>{
    const host = "https://online-maintenance.onrender.com"   
    const TransactionInit = []
    const [transactions, setTransactions] = useState(TransactionInit)       // set list of transactions
    // admin get all transactions by society flatowners
    const getalltransactions = async () => {
        const response = await fetch(`${host}/api/payment/alltransactions`, {
            method: 'GET',
            headers: {
                'auth-token': localStorage.getItem('token')
            },
        });
        const json = await response.json()
        setTransactions(json)
    }
    // admin get all transactions of a single flatowner
    const getusertransactions = async (flat_no) => {
        const response = await fetch(`${host}/api/payment/usertransactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body : JSON.stringify({flat_no})
        });
        const json = await response.json()
        setTransactions(json)
    }
    // flatowner get a record of all his past transactions
    const gettransactions = async () => {
        const response = await fetch(`${host}/api/payment/transactions`, {
            method: 'GET',
            headers: {
                'auth-token': localStorage.getItem('token')
            },
        });
        const json = await response.json()
        setTransactions(json)
    }
    return (
        <TransactionContext.Provider value={{ transactions,getalltransactions,getusertransactions,gettransactions }}>
            {props.children}
        </TransactionContext.Provider>
    )
}

export default TransactionState;