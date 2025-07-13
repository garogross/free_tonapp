import './AdminTransaction.css'
import WithdrawalRequests from "./WithdrawalRequests";
import ReplenishmentTransactions from "./ReplenishmentTransactions";
import { useState } from "react";

export default function AdminTransaction({ adminTransactions, setAdminTransactions }) {
    const [transactionPage, setTransactionPage] = useState("replenishment");

    const handleMenuButtonClick = (transactionPage) => {
        setTransactionPage(transactionPage);
    }

    return (
        <>
            <div className="transaction-menu-button-container">
                <button className={`transaction-menu-button ${transactionPage === 'replenishment' ? 'btn-active' : ''}`} onClick={() => handleMenuButtonClick("replenishment")}>ПОПОЛНЕНИЯ</button>
                <button className={`transaction-menu-button ${transactionPage === 'withdrawal' ? 'btn-active' : ''}`} onClick={() => handleMenuButtonClick("withdrawal")}>ВЫВОД</button>
            </div>
            {transactionPage === "replenishment" ? (
                <ReplenishmentTransactions adminTransactions={adminTransactions} />
            ) : (
                <WithdrawalRequests adminTransactions={adminTransactions} setAdminTransactions={setAdminTransactions} />
            )}
        </>
    )
}