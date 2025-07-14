import React from 'react';
import './TransactionTable.css';

export default function TransactionTable({ transactions }) {

    const moderationStatusToEmoji = (status) => {
        switch(status) {
            case "done": return "✅";
            case "load": return "⏳";
            case "deny": return "❌";
            default: return "❔";
        }
    }

    const renderTransactionTable = () => {
        if (!transactions || transactions.length === 0) {
            return (
                <div className="empty-wrapper">
                    <div className="empty-message">Список пуст</div>
                </div>
            );
        }

        return transactions.map((tx, index) => (
            <div className="transaction-row" key={tx.id || index}>
                <div className="transaction-cell-date">
                    {new Date(tx.utime * 1000).toLocaleString('ru-RU', { hour12: false })}
                </div>
                <div className="transaction-cell">{tx.type}</div>
                <div className="transaction-cell">{tx.amount}</div>
                <div className="transaction-cell">{moderationStatusToEmoji(tx.status)}</div>
            </div>
        ));
    };

    return (
        <div className="transaction-history-wrapper">
            <div className="last-transactions">Последние транзакции</div>
            <div className="transaction-column-names">
                <div className="transaction-column-name">Дата</div>
                <div className="transaction-column-name">Тип</div>
                <div className="transaction-column-name">Сумма</div>
                <div className="transaction-column-name">Статус</div>
            </div>
            <div className="transactions-table">
                {renderTransactionTable()}
            </div>
        </div>
    );
}
