import React, { useContext } from "react";
import TransactionContext from "./TransactionContext";
import Transaction from "./Transaction";
import '../CSS/transactions.css';
const TransactionModal = () => {
    const transcontext = useContext(TransactionContext)
    const { transactions } = transcontext // passing each transaction to Transaction component
    return (
        <div>
            <div className="modal fade" id="exampleModal5" tabIndex="-1" aria-labelledby="exampleModal5Label" aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header cp-head">
                            <h1 className="modal-title fs-5" id="exampleModal5Label">Transaction Record</h1>
                            <i type="button" data-bs-dismiss="modal" aria-label="Close" className="fa-solid fa-xmark fa-2xl" ></i>
                        </div>
                        <div className="modal-body">
                            <div>
                                {transactions.length === 0 && 'No Transaction Till Date'}
                            </div>
                            {transactions.map((transaction) => {
                                return <div>
                                    <Transaction key={transaction._id} transaction={transaction} />
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default TransactionModal