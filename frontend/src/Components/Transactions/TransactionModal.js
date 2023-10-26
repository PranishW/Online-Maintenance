import React, { useContext } from "react";
import TransactionContext from "./TransactionContext";
import Transaction from "./Transaction";
import '../CSS/transactions.css';
const TransactionModal = () => {
    const transcontext = useContext(TransactionContext)
    const { transactions } = transcontext
    return (
        <div>
            <div className="modal fade" id="exampleModal5" tabIndex="-1" aria-labelledby="exampleModal5Label" aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModal5Label">Modal title</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div>
                                {transactions.length === 0 && 'No Transaction Till Date'}
                            </div>
                            {transactions.map((transaction) => {
                                return <Transaction key={transaction._id} transaction={transaction} />
                            })}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default TransactionModal