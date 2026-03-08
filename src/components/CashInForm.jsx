import clsx from "clsx";
import { useTranslation } from "react-i18next";
import styles from "./CashInForm.module.scss";
import { useNotification } from "./useNotification";

export default function CashInForm({ setCurrentContent }) {
  const { t } = useTranslation();
  const { showNotification } = useNotification();

  // Example TON address and button logic
  const tonAddress = "EQB8...TONADDRESS"; // Replace with real address

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(tonAddress);
    showNotification(t("cashIn.successCopy"));
  };

  return (
    <div className={clsx(styles.cashInRequestForm, "container")}>
      <div className={styles.cashInRequestForm__container}>
        <div className={styles.cashInRequestForm__title}>
          {t("cashIn.title")}
        </div>
        <div className={styles.cashInRequestForm__description}>
          {t("cashIn.description")}
        </div>
        {/* <div className={styles.cashInRequestForm__title}>
        {t("cashIn.scanQr")}
      </div> */}
        {/* Placeholder for QR */}
        <div className={styles.cashInRequestForm__inputContainer}></div>
        <div className={styles.cashInRequestForm__title}>
          {t("cashIn.copyAddress")}
        </div>
        <button
          className={styles.cashInRequestForm__unlinkButton}
          onClick={handleCopyAddress}
        >
          {t("common.copy", { defaultValue: "Copy" })}
        </button>
        <button
          className={styles.cashInRequestForm__button}
          onClick={() => setCurrentContent("cashInRequest")}
        >
          {t("common.iPaid", { defaultValue: "I PAID" })}
        </button>
      </div>
    </div>
  );
}
