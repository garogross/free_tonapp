import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Rullet.module.scss";

const getLuckyDigits = (number) => {
  if (number === null || number === undefined) return Array(5).fill("-");
  return number.toString().padStart(5, "0").split("");
};

const Rullet = ({
  currentContent,
  luckyNumber,
  isPushed,
  endTime,
  setIsPushed,
  rollStarted,
  setRollStarted,
  showTimer,
  setShowTimer,
}) => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(0);

  // --- Timer/Result Switch Logic ---
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rollStarted, isPushed, setRollStarted]);

  useEffect(() => {
    if (!showTimer) return;
    function updateTimeLeft() {
      const now = new Date();
      const diff = Math.floor((new Date(endTime) - now) / 1000);
      if (diff <= 0) {
        setTimeLeft(0);
        setShowTimer(false);
        setIsPushed && setIsPushed(false);
      } else {
        setTimeLeft(diff);
      }
    }
    updateTimeLeft();
    const intervalId = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTimer, endTime, setIsPushed]);

  // Digits for number
  const digits =
    currentContent === "cran"
      ? getLuckyDigits(luckyNumber)
      : getLuckyDigits(null);

  return (
    <div className={styles.rullet}>
      {currentContent === "cran" && (
        <>
          {showTimer ? (
            <>
              {/* Timer digits */}
              {(() => {
                const m = Math.floor((timeLeft % 3600) / 60)
                  .toString()
                  .padStart(2, "0");
                const s = (timeLeft % 60).toString().padStart(2, "0");
                return (
                  <>
                    <div className={styles.rullet__item}>
                      <span className={styles.rullet__itemText}>{m[0]}</span>
                    </div>
                    <div className={styles.rullet__item}>
                      <span className={styles.rullet__itemText}>{m[1]}</span>
                    </div>
                    <div className={styles.rullet__item}>
                      <span className={styles.rullet__itemText}>:</span>
                    </div>
                    <div className={styles.rullet__item}>
                      <span className={styles.rullet__itemText}>{s[0]}</span>
                    </div>
                    <div className={styles.rullet__item}>
                      <span className={styles.rullet__itemText}>{s[1]}</span>
                    </div>
                  </>
                );
              })()}
              <p className={styles.rullet__nextGatheringText}>
                {t("rulletUntilNext")}
              </p>
            </>
          ) : (
            <>
              {digits.map((digit, idx) => (
                <div className={styles.rullet__item} key={idx}>
                  <span className={styles.rullet__itemText}>{digit}</span>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Rullet;
