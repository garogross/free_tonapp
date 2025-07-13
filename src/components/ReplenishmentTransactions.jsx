import './ReplenishmentTransactions.css'
import { useNotification } from './useNotification'

export default function ReplenishmentTransactions({ adminTransactions }) {
    const { showNotification } = useNotification();

    const copyTelegramUsername = (telegramUsername) => {
        if (telegramUsername != "username_not_found") {
            navigator.clipboard.writeText(telegramUsername)
            showNotification("Username пользователя скопирован", 2000);
        }
    }

    const copyTelegramId = (telegramId) => {
        navigator.clipboard.writeText(telegramId)
        showNotification("Id пользователя скопирован", 2000);
    }

    const copySenderAddress = (senderAdress) => {
        navigator.clipboard.writeText(senderAdress)
        showNotification("Адрес кошелька скопирован", 2000)
    }

    const renderReplenishmentTransactions = () => {
        const countInTransactions = adminTransactions.filter(tx => tx.transaction.type === "in").length;

        if (!adminTransactions || adminTransactions.length === 0 || countInTransactions === 0) {
            return (
                <div className="empty-wrapper">
                    <div className="empty-message">Список пуст</div>
                </div>
            );
        }

        return adminTransactions.map((tx, index) => tx.transaction.type === "in" && (
                <div className="replenishment-transaction-row" key={tx.id || index}>
                    <div className="transaction-cell-date">
                        Дата: {new Date(tx.transaction.utime * 1000).toLocaleString('ru-RU', { hour12: false })}
                    </div>
                    <div className="transaction-cell">Сумма: {tx.transaction.amount} TON</div>
                    <div className='transaction-cell' onClick={() => copySenderAddress(tx.transaction.senderAddress)}>Адрес: {tx.transaction.senderAddress}</div>
                    <div className="transaction-cell" onClick={() => copyTelegramUsername(tx.telegramUsername)}>Имя пользователя: {tx.telegramUsername === 'username_not_found' ? '--------' : tx.telegramUsername}</div>
                    <div className="transaction-cell" onClick={() => copyTelegramId(tx.telegramId)}>Telegram id пользователя: {tx.telegramId}</div>
                </div>
        ));
    }

    return (
        <div>
            {renderReplenishmentTransactions()}
        </div>
    )
}