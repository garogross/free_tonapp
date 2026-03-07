import { retrieveRawInitData } from "@telegram-apps/sdk";
import "./WithdrawalRequests.css";
import { useNotification } from "./useNotification";

export default function WithdrawalRequests({
  adminTransactions,
  setAdminTransactions,
}) {
  const { showNotification, showError } = useNotification();

  const copyTelegramUsername = (telegramUsername) => {
    if (telegramUsername != "username_not_found") {
      navigator.clipboard.writeText(telegramUsername);
      showNotification("Username пользователя скопирован", 2000);
    }
  };

  const copyTelegramId = (telegramId) => {
    navigator.clipboard.writeText(telegramId);
    showNotification("Id пользователя скопирован", 2000);
  };

  const copySenderAddress = (senderAdress) => {
    navigator.clipboard.writeText(senderAdress);
    showNotification("Адрес кошелька скопирован", 2000);
  };

  const copyMemoPhrase = (senderAdress) => {
    navigator.clipboard.writeText(senderAdress);
    showNotification("Memo фраза скопирована", 2000);
  };

  const handleDecision = (id, decision) => {
    let dataRaw;
    try {
      dataRaw = retrieveRawInitData();
    } catch (error) {
      console.error("Error retrieving raw init data:", error);
      dataRaw = null;
    }
    const postData = {
      id: id,
      decision: decision,
    };
    api
      .post("/api/freetonadmin/transactions", postData)
      .then((response) => {
        setAdminTransactions(response.data.transactionsWithUser);
        showNotification("Успешно выполнено");
      })
      .catch((error) => {
        showError("Не удалось выполнить");
        console.error("Post decision error: ", error);
      });
  };

  const renderWithdrawlRequestTransactions = () => {
    const countOutTransactions = adminTransactions.filter(
      (tx) => tx.transaction.type === "out",
    ).length;

    if (
      !adminTransactions ||
      adminTransactions.length === 0 ||
      countOutTransactions === 0
    ) {
      return (
        <div className="empty-wrapper">
          <div className="empty-message">Список пуст</div>
        </div>
      );
    }

    return adminTransactions.map(
      (tx, index) =>
        tx.transaction.type === "out" && (
          <div className="withdrawal-request-container" key={tx.id || index}>
            <div className="transaction-row">
              <div className="transaction-cell-date">
                {new Date(tx.transaction.utime * 1000).toLocaleString("ru-RU", {
                  hour12: false,
                })}
              </div>
              <div className="transaction-cell">
                {tx.transaction.amount}{" "}
                {tx.transaction.starsMode ? "STARS" : "TON"}
              </div>
              <div
                className="transaction-cell"
                onClick={() => copySenderAddress(tx.transaction.senderAddress)}
              >
                {tx.transaction.senderAddress}
              </div>
              <div
                className="transaction-cell"
                onClick={() => copyTelegramUsername(tx.telegramUsername)}
              >
                {tx.telegramUsername === "username_not_found"
                  ? "--------"
                  : tx.telegramUsername}
              </div>
              <div
                className="transaction-cell"
                onClick={() => copyTelegramId(tx.telegramId)}
              >
                {tx.telegramId}
              </div>
            </div>
            {tx.transaction.memoPhrase != "" &&
              tx.transaction.memoPhrase != null && (
                <div
                  className="transaction-cell memo"
                  onClick={() => copyMemoPhrase(tx.transaction.memoPhrase)}
                >
                  MEMO: {tx.transaction.memoPhrase}
                </div>
              )}
            {tx.transaction.status === "load" ? (
              <div className="withdrawal-request-buttons">
                <button
                  className="withdrawal-button yes"
                  onClick={() => handleDecision(tx.id, "done")}
                >
                  ОДОБРИТЬ
                </button>
                <button
                  className="withdrawal-button no"
                  onClick={() => handleDecision(tx.id, "deny")}
                >
                  ОТКЛОНИТЬ
                </button>
              </div>
            ) : tx.transaction.status === "deny" ? (
              <div className="withdrawal-status">ОТКЛОНЕНО</div>
            ) : (
              <div className="withdrawal-status">ОДОБРЕНО</div>
            )}
          </div>
        ),
    );
  };

  return <div>{renderWithdrawlRequestTransactions()}</div>;
}
