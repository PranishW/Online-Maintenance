import React from "react";
import '../CSS/transactions.css';
const Transaction = (props) => {
    const { transaction } = props
    return (
        <div>
            <div>{transaction.flat_no}</div>
        </div>
    )
}
export default Transaction