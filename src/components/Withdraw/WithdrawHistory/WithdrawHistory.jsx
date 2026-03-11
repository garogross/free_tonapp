import clsx from "clsx";
import { useTranslation } from "react-i18next";
import styles from "./WithdrawHistory.module.scss";

const WithdrawHistory = ({ transactions }) => {
  const { t } = useTranslation();
  const getStatusText = (status) => {
    switch (status) {
      case "done":
        return t("transactionTable.completed");
      case "load":
        return t("transactionTable.pending");
      case "deny":
        return t("transactionTable.rejected");
      default:
        return t("transactionTable.pending");
    }
  };
  return (
    <div className={styles.withdrawHistory}>
      <h3 className={styles.withdrawHistory__titleText}>
        {t("transactionTable.lastTransactions")}
      </h3>
      <div className={styles.withdrawHistory__list}>
        {!transactions?.length ? (
          <h6 className={styles.withdrawHistory__messageText}>
            {t("emptyList")}
          </h6>
        ) : (
          transactions.map((tx, index) => (
            <div key={index} className={styles.withdrawHistory__listItem}>
              <span className={styles.withdrawHistory__listItemText}>
                {new Date(tx.utime * 1000).toLocaleDateString("ru-RU")}
              </span>
              <span
                className={clsx(
                  styles.withdrawHistory__listItemText,
                  styles.withdrawHistory__listItemText_stars,
                )}
              >
                {tx.amount} Stars
              </span>
              <span
                className={clsx(
                  styles.withdrawHistory__listItemText,
                  styles[
                    `withdrawHistory__listItemText_${tx.status.toLowerCase()}`
                  ],
                )}
              >
                - {getStatusText(tx.status)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WithdrawHistory;
