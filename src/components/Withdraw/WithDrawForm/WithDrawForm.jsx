import { retrieveLaunchParams } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../../api/axios";
import ArrowBottomIcon from "../../icons/Common/ArrowBottomIcon";
import CopyIcon from "../../icons/Common/CopyIcon";
import SecondaryBtn from "../../layout/SecondaryBtn/SecondaryBtn";
import { useNotification } from "../../useNotification";
import styles from "./WithDrawForm.module.scss";

const MIN_AMOUNT = 50;

const WithDrawForm = ({
  tonBalance,
  course,
  setTransactions,
  setTonBalance,
  goBack,
}) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [memoPhrase, setMemoPhrase] = useState("");
  const { showError, showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [tgUsername, setTgUsername] = useState("");

  useEffect(() => {
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
  }, []);

  async function cashOutTransaction() {
    setIsLoading(true);
    const postData = {
      cashOutAddress: tgUsername,
      amount: amount,
      memoPhrase: memoPhrase,
      starsMode: true,
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

  function toFixedDown(number, digits) {
    const factor = Math.pow(10, digits);
    return Math.floor(number * factor) / factor;
  }

  const handleCashOutAll = () => {
    if (tonBalance < 1) {
      showError(t("cashOutForm.minimumSumError"));
      return;
    }
    setAmount(toFixedDown(tonBalance * course, 0));
  };

  const handleCashOut = () => {
    if (
      !amount ||
      isNaN(amount) ||
      Number(amount) <= 0 ||
      amount < MIN_AMOUNT
    ) {
      showError(t("cashOutForm.enterValidAmount"));
      return;
    }
    if (tonBalance < 1 || amount > tonBalance * course || amount < course) {
      showError(t("cashOutForm.insufficientFunds"));
      return;
    }

    cashOutTransaction();
  };

  return (
    <div className={styles.withDrawForm}>
      <div className={styles.withDrawForm__header}>
        <button onClick={goBack} className={styles.withDrawForm__backBtn}>
          <ArrowBottomIcon className={styles.withDrawForm__arrowIcon} />
        </button>
        <h3 className={styles.withDrawForm__title}>{t("cashOut")}</h3>
        <div></div>
      </div>
      <div className={styles.withDrawForm__main}>
        <div className={styles.withDrawForm__inputWrapper}>
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            className={styles.withDrawForm__input}
            placeholder={t("cashOutForm.amountPlaceholder")}
          />
          <button
            type="button"
            onClick={handleCashOutAll}
            className={styles.withDrawForm__setMAxBtn}
          >
            MAX
          </button>
        </div>
        <div className={styles.withDrawForm__inputWrapper}>
          <input
            type="text"
            className={styles.withDrawForm__input}
            placeholder="@username_tg_account"
            value={tgUsername}
            onChange={(e) => setTgUsername(e.target.value)}
          />
          <button
            className={styles.withDrawForm__copyBtn}
            type="button"
            onClick={() => {
              if (navigator && navigator.clipboard) {
                navigator.clipboard.writeText(tgUsername);
                showNotification(t("addTelegramChallengeForm.usernameCopied"));
              }
            }}
          >
            <CopyIcon />
          </button>
        </div>
        <div className={styles.withDrawForm__infoBlock}>
          <p className={styles.withDrawForm__info}>
            {t("cashOutForm.minAmount.stars")}:{" "}
            <span className="primaryLightText">{MIN_AMOUNT} Stars</span>
          </p>
        </div>
        <SecondaryBtn onClick={handleCashOut} disabled={isLoading}>
          {t("cashOut").toUpperCase()}
        </SecondaryBtn>
      </div>
    </div>
  );
};

export default WithDrawForm;
