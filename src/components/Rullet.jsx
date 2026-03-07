import { retrieveRawInitData } from "@telegram-apps/sdk";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../api/axios";
import "./Rullet.css";
import { useNotification } from "./useNotification";

export default function Rullet(props) {
  const {
    currentContent,
    gridRow,
    setCurrentContent,
    luckyNumber,
    isPushed,
    endTime,
    setIsPushed,
    rollStarted,
    setRollStarted,
    tonBalance,
    lastRollNumber,
  } = props;
  const { t } = useTranslation();

  const [showTimer, setShowTimer] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [walletButton, setWalletButton] = useState(t("rulletConnect"));
  const [payload, setPayload] = useState(null);
  const [proof, setProof] = useState(null);
  const [walletAccount, setWalletAccount] = useState(null);
  const { showError } = useNotification();

  const getLuckyDigits = (number) => {
    if (number === null) return Array(5).fill("--");
    return number.toString().padStart(5, "0").split("");
  };
  const digits = getLuckyDigits(luckyNumber);

  const [tonConnectUI] = useTonConnectUI();
  const userFriendlyAddress = useTonAddress();

  let dataRaw;
  try {
    dataRaw = retrieveRawInitData();
  } catch (error) {
    console.error("Error retrieving raw init data:", error);
    dataRaw = null;
  }

  useEffect(() => {
    if (isPushed) {
      setShowTimer(false);
      if (!rollStarted) {
        setShowTimer(true);
        return;
      }
      const timeoutId = setTimeout(() => {
        setShowTimer(true);
        setRollStarted(false);
      }, 6000);
      return () => clearTimeout(timeoutId);
    } else {
      setShowTimer(false);
    }
  }, [rollStarted, isPushed]);

  useEffect(() => {
    if (!showTimer) return;

    function updateTimeLeft() {
      const now = new Date();
      const diff = Math.floor((new Date(endTime) - now) / 1000);
      if (diff <= 0) {
        setTimeLeft(0);
        setShowTimer(false);
        setIsPushed(false);
      } else {
        setTimeLeft(diff);
      }
    }
    updateTimeLeft();

    const intervalId = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(intervalId);
  }, [showTimer, endTime, setIsPushed]);

  useEffect(
    () =>
      tonConnectUI.onStatusChange((wallet) => {
        if (
          wallet.connectItems?.tonProof &&
          "proof" in wallet.connectItems.tonProof
        ) {
          setProof(wallet.connectItems.tonProof.proof);
          setWalletAccount(wallet.account);
        }
      }),
    [],
  );

  const PrettyTimer = (secondsLeft) => {
    const m = Math.floor((secondsLeft % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (secondsLeft % 60).toString().padStart(2, "0");

    return (
      <div className="pretty-timer">
        <div className="timer-block">
          <div className="timer-digits">
            <span className="timer-digit">{m[0]}</span>
            <span className="timer-digit">{m[1]}</span>
          </div>
          <span className="timer-label">{t("rulletMinuts")}</span>
        </div>
        <span className="timer-separator">:</span>
        <div className="timer-block">
          <div className="timer-digits">
            <span className="timer-digit">{s[0]}</span>
            <span className="timer-digit">{s[1]}</span>
          </div>
          <span className="timer-label">{t("rulletSeconds")}</span>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!proof || !payload || !userFriendlyAddress) return;

    const sendProof = async () => {
      try {
        const response = await api.post(
          "/api/verify-ton-proof",
          {
            tonProof: proof,
            walletAccount,
          },
          {
            headers: {
              Authorization: "tma " + dataRaw,
            },
          },
        );

        if (response.status === 200) {
          setWalletButton(t("rulletTopUp"));
          setCurrentContent("cashInRequest");
        } else {
          throw new Error("Proof verification failed");
        }
      } catch (error) {
        showError(
          t("rulletAddressCheckError") +
            ": " +
            (error.response?.data?.error || error.message),
        );
        setWalletButton(t("rulletConnect"));
      }
    };

    sendProof();
  }, [
    proof,
    payload,
    userFriendlyAddress,
    dataRaw,
    setCurrentContent,
    walletAccount,
  ]);

  const handleTonConnectClick = async () => {
    try {
      if (!userFriendlyAddress) {
        const { data: payload } = await api.get(
          "/api/generate-ton-proof-payload",
          {
            headers: {
              Authorization: "tma " + dataRaw,
            },
          },
        );

        setPayload(payload);

        tonConnectUI.setConnectRequestParameters({
          state: "ready",
          value: { tonProof: payload.payloadToken },
        });

        await tonConnectUI.openModal();
      } else if (walletButton === t("rulletTopUp")) {
        setCurrentContent("cashInRequest");
      }
    } catch (error) {
      console.error(t("rulletAddressCheckError"), error);
      showError(error.message || error);
      setWalletButton(t("rulletConnect"));
    }
  };

  useEffect(() => {
    setWalletButton(t("rulletConnect"));
  }, [t("rulletConnect")]);

  useEffect(() => {
    if (userFriendlyAddress && walletButton === t("rulletConnect")) {
      setWalletButton(t("rulletTopUp"));
    }
  }, [userFriendlyAddress, walletButton]);

  return (
    <div className="rullet" grid-row={gridRow}>
      <div className="rullet-title">{t("yourBalanceTitle")}</div>
      <div className="rullet-balance">
        <div className="rullet-balance-value">
          {props.starsMode
            ? (tonBalance * props.course).toFixed(6)
            : tonBalance.toFixed(6)}
        </div>
        <div className="rullet-balance-icon">
          {props.starsMode ? (
            <img
              src="/assets/tg-star.svg"
              alt="TON"
              className="star-switch-icon"
            />
          ) : (
            <img src="/assets/ton.svg" alt="TON" />
          )}
        </div>
      </div>

      {currentContent === "cran" && (
        <>
          <div className="rullet-subtitle">
            {isPushed ? t("rulletTimerTitle") : t("droppedNumber")}
          </div>
          <div
            className={`rullet-result-container ${isPushed && !rollStarted ? "pushed" : ""}`}
          >
            {showTimer ? (
              <div className="rullet-timer">{PrettyTimer(timeLeft)}</div>
            ) : (
              <div className="rullet-result-numbers">
                <div className="rullet-result-number-item1">{digits[0]}</div>
                <div className="rullet-result-number-item2">{digits[1]}</div>
                <div className="rullet-result-number-item3">{digits[2]}</div>
                <div className="rullet-result-number-item4">{digits[3]}</div>
                <div className="rullet-result-number-item5">{digits[4]}</div>
              </div>
            )}
          </div>
          {showTimer && (
            <div className="rullet-last-roll-number">
              {t("dropped")} {lastRollNumber}
            </div>
          )}
        </>
      )}

      {currentContent === "profile" && (
        <div className="profile-buttons">
          <button className="cash-in" onClick={handleTonConnectClick}>
            {walletButton}
          </button>
          <button
            className="cash-out"
            onClick={() => setCurrentContent("cashOut")}
          >
            {t("cashOut")}
          </button>
        </div>
      )}
    </div>
  );
}
