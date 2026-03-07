import { retrieveLaunchParams, retrieveRawInitData } from "@telegram-apps/sdk";
import { useTonAddress } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./CashOutForm.css";
import { useNotification } from "./useNotification";

export default function CashOutForm({
  tonBalance,
  setTonBalance,
  setTransactions,
  starsMode,
  course,
}) {
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [memoPhrase, setMemoPhrase] = useState("");
  const { showError, showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [tgUsername, setTgUsername] = useState("");
  const userFriendlyAddress = useTonAddress();
  const { t } = useTranslation();

  useEffect(() => {
    setWalletAddress(userFriendlyAddress);

    let initData;
    try {
      initData = retrieveLaunchParams();
    } catch (error) {
      console.error("Error retrieving launch params:", error);
      initData = null;
    }
    if (initData?.tgWebAppData?.user?.username) {
      setTgUsername(initData?.tgWebAppData.user.username);
    }
  }, [userFriendlyAddress]);

  function isPotentialTonAddress(address) {
    const regex = /^[A-Za-z0-9_-]{47,49}$/;
    return regex.test(address);
  }

  async function cashOutTransaction(dataRaw) {
    setIsLoading(true);
    const postData = {
      cashOutAddress: starsMode ? tgUsername : walletAddress,
      amount: amount,
      memoPhrase: memoPhrase,
      starsMode: starsMode,
    };
    api
      .post("/api/transactions", postData)
      .then((response) => {
        setTransactions(response.data.transactions);
        setTonBalance(response.data.tonBalance);
        setAmount("");
        setMemoPhrase("");
        showNotification(t("cashOutForm.requestSent"));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Create transaction error: ", error);
        showError(t("cashOutForm.failedToCreateRequest"));
        setIsLoading(false);
      });
  }

  const handleAmountChange = (e) => {
    let value = e.target.value;

    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }

    if (value.includes(".")) {
      const [intPart, decimalPart] = value.split(".");
      if (decimalPart.length > 2) {
        value = intPart + "." + decimalPart.slice(0, 2);
      }
    }

    setAmount(value);
  };

  const handleMemoPhraseChange = (e) => {
    let value = e.target.value;
    const maxLength = 20;
    value = value.replace(/[^a-zA-Z0-9]/g, "");

    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
      showError(t("cashOutForm.maxMemoLength"));
    }

    setMemoPhrase(value);
  };

  function toFixedDown(number, digits) {
    const factor = Math.pow(10, digits);
    return Math.floor(number * factor) / factor;
  }

  const handleCashOutAll = () => {
    if (tonBalance < 1) {
      showError(t("cashOutForm.minimumSumError"));
      return;
    }
    setAmount(
      starsMode
        ? toFixedDown(tonBalance * course, 0)
        : toFixedDown(tonBalance, 2).toString(),
    );
  };

  const handleCashOut = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0 || amount < 1) {
      showError(t("cashOutForm.enterValidAmount"));
      return;
    }
    if (starsMode) {
      if (tonBalance < 1 || amount > tonBalance * course || amount < course) {
        showError(t("cashOutForm.insufficientFunds"));
        return;
      }
    } else {
      if (tonBalance < 1 || amount > tonBalance) {
        showError(t("cashOutForm.insufficientFunds"));
        return;
      }
    }
    if (!starsMode) {
      if (!isPotentialTonAddress(walletAddress)) {
        showError(t("cashOutForm.invalidTonAddress"));
        return;
      }
    }

    let dataRaw;
    try {
      dataRaw = retrieveRawInitData();
    } catch (error) {
      console.error("Error retrieving raw init data:", error);
      dataRaw = null;
    }
    cashOutTransaction(dataRaw);
  };

  return (
    <div className="cash-out-form">
      <div className="cash-out-form-title">{t("cashOutForm.title")}</div>
      <div className="cash-out-form-description">
        {starsMode
          ? t("cashOutForm.description.stars")
          : t("cashOutForm.description.ton")}
      </div>
      <div className="cash-out-form-input-container">
        <input
          className="cash-out-form-input"
          type="text"
          placeholder={t("cashOutForm.amountPlaceholder")}
          value={amount}
          onChange={handleAmountChange}
        />
        {starsMode ? (
          <input
            className="cash-out-form-input memo"
            type="text"
            placeholder={t("cashOutForm.usernamePlaceholder")}
            value={starsMode ? tgUsername : walletAddress}
            onChange={(e) => setTgUsername(e.target.value)}
          />
        ) : (
          <textarea
            className="cash-out-form-textarea"
            placeholder={t("cashOutForm.addressPlaceholder")}
            rows="3"
            value={starsMode ? tgUsername : walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
        )}
        {!starsMode && (
          <input
            className="cash-out-form-input memo"
            type="text"
            placeholder={t("cashOutForm.memoPhrasePlaceholder")}
            value={memoPhrase}
            onChange={handleMemoPhraseChange}
          />
        )}
      </div>
      <div className="min-amount">
        {starsMode
          ? t("cashOutForm.minAmount.stars", { min: course })
          : t("cashOutForm.minAmount.ton")}
      </div>
      <div className="cash-out-button-wrapper">
        <button
          className={`cash-out-form-button ${tonBalance < 1 || isLoading ? "disable-view" : ""}`}
          onClick={handleCashOut}
          disabled={isLoading}
        >
          {t("cashOutForm.submitRequest")}
        </button>
        <button className="cash-out-form-all-button" onClick={handleCashOutAll}>
          {t("cashOutForm.cashOutAll")}
        </button>
        <div className="alert-description">
          {t("cashOutForm.alertDescription")}
        </div>
      </div>
    </div>
  );
}
