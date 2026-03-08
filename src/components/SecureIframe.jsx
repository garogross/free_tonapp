import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { api } from "../api/axios";
import styles from "./SecureIframe.module.scss";
import { useNotification } from "./useNotification";

const SecureIframe = ({
  currentSurfingChallenge,
  setCurrentContent,
  setChallenges,
  setTonBalance,
}) => {
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(9999);
  const { showError, showNotification } = useNotification();

  useEffect(() => {
    setLoading(true);
    setTimeLeft(currentSurfingChallenge?.timeOfExecution);
  }, [currentSurfingChallenge]);

  useEffect(() => {
    if (!loading && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [loading, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleEndOfTime();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const handleEndOfTime = () => {
    setCurrentContent("challenges");

    api
      .get("/api/challenge/iframeend")
      .then((response) => {
        setChallenges(response.data);
        setTonBalance(response.data.tonBalance);
        showNotification("Успешно выполнено");
      })
      .catch((error) => {
        console.error("error view telegram challenge: ", error);
        showError("Не удалось выполнить");
      });
  };

  const handleStartOfTime = (id) => {
    const postData = {
      id: id,
    };
    api
      .post("/api/challenge/iframestart", postData)
      .then(() => {
        showNotification("Оставайтесь на странице");
      })
      .catch((error) => {
        console.error("error view telegram challenge: ", error);
        showError("Не удалось начать");
        setCurrentContent("challenges");
      });
  };

  return (
    <div className={clsx(styles.secureIframe__container, "container")}>
      {loading && (
        <div className={styles.secureIframe__loading}>Загружается...</div>
      )}
      {!loading && timeLeft > 0 && (
        <div className={styles.secureIframe__timerWrapper}>
          <div className={styles.secureIframe__timerBlock}>
            <div className={styles.secureIframe__timerLabel}>
              Оставшееся время
            </div>
            <div className={styles.secureIframe__timerDigits}>
              <span className={styles.secureIframe__timerDigit}>
                {Math.floor(timeLeft / 10)}
              </span>
              <span className={styles.secureIframe__timerDigit}>
                {timeLeft % 10}
              </span>
            </div>
            <span className={styles.secureIframe__timerSeparator}>секунд</span>
          </div>
        </div>
      )}
      <iframe
        src={currentSurfingChallenge?.link}
        title={currentSurfingChallenge?.name}
        className={`${styles.secureIframe__iframe} ${loading || timeLeft === 0 ? styles.secureIframe__iframeHidden : ""}`}
        sandbox="allow-scripts allow-forms"
        loading="lazy"
        allow="fullscreen"
        onLoad={() => {
          setLoading(false);
          handleStartOfTime(currentSurfingChallenge?.id);
        }}
      />
      {!loading && timeLeft === 0 && (
        <div className={styles.secureIframe__timeEnded}>
          Время просмотра истекло
        </div>
      )}
    </div>
  );
};

export default SecureIframe;
