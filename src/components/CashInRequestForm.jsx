import { useTonConnectUI } from "@tonconnect/ui-react";
import clsx from "clsx";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./CashInRequestForm.module.scss";
import { useNotification } from "./useNotification";

export default function CashInRequestForm({
  setCurrentContent,
  addTransaction,
}) {
  const [tonConnectUI] = useTonConnectUI();
  const [amount, setAmount] = useState("");
  const { showNotification, showError } = useNotification();
  const { t } = useTranslation();

  const requestTransaction = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      showError(t("cashInRequestForm.enterValidAmount"));
      return;
    }

    const amountNumber = Number(amount);

    if (amountNumber < 1) {
      showError(t("cashInRequestForm.minAmountError", { min: 1 }));
      return;
    }

    const amountNano = (amountNumber * 1_000_000_000).toFixed(0);

    const transaction = {
      validUntil: Date.now() + 5 * 60 * 1000,
      messages: [
        {
          address: "UQAKWDA4PO2M-0pzlod3BsYufxC99OOzUnGeQT2dm4ruw3fU",
          amount: amountNano,
        },
      ],
    };

    try {
      await tonConnectUI.sendTransaction(transaction);
      addTransaction({
        utime: Math.floor(Date.now() / 1000),
        type: "in",
        amount: amount,
        status: "load",
      });
      showNotification(t("cashInRequestForm.transactionSent"), 6000);
    } catch (error) {
      const message = error?.message || String(error);
      showError(message);
      console.error("Ошибка при отправке транзакции:", error);
    }
  };

  const unlinkWallet = () => {
    tonConnectUI.disconnect();
    setCurrentContent("profile");
  };

  return (
    <div className={clsx(styles.cashInRequestForm, "container")}>
      <div className={styles.cashInRequestForm__container}>
        <div className={styles.cashInRequestForm__title}>
          {t("cashInRequestForm.title")}
        </div>
        <div className={styles.cashInRequestForm__description}>
          {t("cashInRequestForm.description")}
        </div>
        <div className={styles.cashInRequestForm__inputContainer}>
          <input
            className={styles.cashInRequestForm__input}
            type="text"
            placeholder={t("cashInRequestForm.amountPlaceholder")}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button
          className={styles.cashInRequestForm__button}
          onClick={requestTransaction}
        >
          {t("cashInRequestForm.topUp")}
        </button>
        <button
          className={styles.cashInRequestForm__unlinkButton}
          onClick={unlinkWallet}
        >
          {t("cashInRequestForm.unlink")}
        </button>
      </div>
    </div>
  );
}
