import axios from 'axios';
import './WithdrawalRequests.css'
import { useNotification } from './useNotification'
import { retrieveRawInitData } from '@telegram-apps/sdk'

export default function WithdrawalRequests({ adminTransactions, setAdminTransactions }) {
  const { showNotification, showError } = useNotification();

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

  const handleDecision = (id, decision) => {
    const dataRaw = retrieveRawInitData();
    const postData = {
      id: id,
      decision: decision
    };
    axios.post('/api/freetonadmin/transactions', postData, {
      headers: {
        'Authorization': 'tma ' + dataRaw
      }
    })
      .then(response => {
        setAdminTransactions(response.data.transactionsWithUser);
        showNotification("Успешно выполнено")
      })
      .catch(error => {
        showError("Не удалось выполнить")
        console.error('Post decision error: ', error);
      })
  }

  const renderWithdrawlRequestTransactions = () => {
    const countOutTransactions = adminTransactions.filter(tx => tx.transaction.type === "out").length;

    if (!adminTransactions || adminTransactions.length === 0 || countOutTransactions === 0) {
      return (
        <div className="empty-wrapper">
          <div className="empty-message">Список пуст</div>
        </div>
      );
    }

    return adminTransactions.map((tx, index) => tx.transaction.type === "out" && (
      <div className="withdrawal-request-container" key={tx.id || index}>
        <div className="transaction-row">
          <div className="transaction-cell-date">
            {new Date(tx.transaction.utime * 1000).toLocaleString('ru-RU', { hour12: false })}
          </div>
          <div className="transaction-cell">{tx.transaction.amount} TON</div>
          <div className='transaction-cell' onClick={() => copySenderAddress(tx.transaction.senderAddress)}>{tx.transaction.senderAddress}</div>
          <div className="transaction-cell" onClick={() => copyTelegramUsername(tx.telegramUsername)}>{tx.telegramUsername === 'username_not_found' ? '--------' : tx.telegramUsername}</div>
          <div className="transaction-cell" onClick={() => copyTelegramId(tx.telegramId)}>{tx.telegramId}</div>
        </div>
        {tx.transaction.status === 'load' ? (
          <div className='withdrawal-request-buttons'>
            <button className='withdrawal-button yes' onClick={() => handleDecision(tx.id, 'done')}>ОДОБРИТЬ</button>
            <button className='withdrawal-button no' onClick={() => handleDecision(tx.id, 'deny')}>ОТКЛОНИТЬ</button>
          </div>
        ) : tx.transaction.status === 'deny' ? (
          <div className="withdrawal-status">ОТКЛОНЕНО</div>
        ) : (
          <div className="withdrawal-status">ОДОБРЕНО</div>
        )}
      </div>
    ));
  }

  return (
    <div>
      {renderWithdrawlRequestTransactions()}
    </div>
  )
}
