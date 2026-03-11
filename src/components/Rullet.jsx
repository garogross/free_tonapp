import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Rullet.module.scss";

const getLuckyDigits = (number) => {
  if (number === null || number === undefined) return Array(5).fill("-");
  return number.toString().padStart(5, "0").split("");
};

const generateRandomRulletNumbers = () => {
  return Array.from({ length: 5 }, () =>
    Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)),
  );
};

const timeArray = Array.from({ length: 10 }, (_, i) => i);

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
  isAnimating,
}) => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(0);
  const [randomRulletNumbers, setRandomRulletNumbers] = useState(
    generateRandomRulletNumbers(),
  );

  // --- Timer/Result Switch Logic ---
  useEffect(() => {
    if (isPushed) {
      setRandomRulletNumbers(generateRandomRulletNumbers());
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

  console.log({ timeArray });

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
                console.log({ m, s });

                return (
                  <>
                    <div className={styles.rullet__item}>
                      <span
                        className={styles.rullet__itemText}
                        style={{
                          height: `1000%`,
                          transform: `translateY(-${m[0]}0%)`,
                        }}
                      >
                        {timeArray.map((num) => (
                          <span>{num}</span>
                        ))}
                        {/* {m[0]} */}
                      </span>
                    </div>
                    <div className={styles.rullet__item}>
                      <span
                        className={styles.rullet__itemText}
                        style={{
                          height: `1000%`,
                          transform: `translateY(-${m[1]}0%)`,
                        }}
                      >
                        {timeArray.map((num) => (
                          <span>{num}</span>
                        ))}
                        {/* {m[1]} */}
                      </span>
                    </div>
                    <div className={styles.rullet__item}>
                      <span className={styles.rullet__itemText}>
                        <span>:</span>
                      </span>
                    </div>
                    <div className={styles.rullet__item}>
                      <span
                        className={styles.rullet__itemText}
                        style={{
                          height: `1000%`,
                          transform: `translateY(-${s[0]}0%)`,
                        }}
                      >
                        {timeArray.map((num) => (
                          <span>{num}</span>
                        ))}
                        {/* {m[0]} */}
                      </span>
                    </div>
                    <div className={styles.rullet__item}>
                      <span
                        className={styles.rullet__itemText}
                        style={{
                          height: `1000%`,
                          transform: `translateY(-${s[1]}0%)`,
                        }}
                      >
                        {timeArray.map((num) => (
                          <span>{num}</span>
                        ))}
                        {/* {m[1]} */}
                      </span>
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
                  <span
                    key={idx}
                    className={clsx(
                      styles.rullet__itemText,
                      isAnimating && styles.rullet__itemText_anim,
                    )}
                    style={{ height: `${randomRulletNumbers[0].length}00%` }}
                  >
                    {randomRulletNumbers[idx].map((num, index, arr) => (
                      <span>
                        {!index || index === arr.length - 1 ? digit : num}
                      </span>
                    ))}
                  </span>
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
