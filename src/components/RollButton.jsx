import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { adIconImg, adIconWebpImg } from "../assets/images";
import ImageWebp from "./layout/ImageWebp/ImageWebp";
import MainButton from "./layout/MainButton/MainButton";
import styles from "./RollButton.module.scss";
import { useNotification } from "./useNotification";

export default function RollButton({
  setIsSkipAvailable,
  setIsPushed,
  setEndTime,
  setSkipEndTime,
  isAnimating,
  setLuckyNumber,
  setTonBalance,
  isPushed,
  setIsAnimating,
  setRollStarted,
  showTimer,
  isSkipAvailable,
}) {
  const { showError, showNotification } = useNotification();
  const [rollSuccesfullResponse, setRollSuccessfullResponse] = useState(null);

  async function checkIsRollAvailable() {
    api
      .get("/api/checkroll")
      .then((response) => {
        setIsPushed(!response.data.isAvailable);
        const endDateTime = new Date(response.data.endTime);
        const skipEndDateTime = new Date(response.data.skipEndTime);
        setEndTime(endDateTime);
        setSkipEndTime(skipEndDateTime);
        setIsSkipAvailable(response.data.isSkipAvailable);
      })
      .catch((error) => {
        console.error("Check is roll available error: ", error);
      });
  }

  const fetchSkipRollTime = () => {
    api
      .get("/api/skiprolltime")
      .then((res) => {
        setIsPushed(!res.data.isAvailable);
        const endDateTime = new Date(res.data.endTime);
        setEndTime(endDateTime);
        const now = new Date();
        const minutesLater = new Date(now.getTime() + 60 * 60 * 1000);
        setSkipEndTime(minutesLater);
        setIsSkipAvailable(false);
        showNotification("Таймер пропущен", 5000);
      })
      .catch((error) => {
        if (error.response && error.response.status === 429) {
          showError("Попробуйте позже");
          setIsSkipAvailable(false);
        } else {
          showError(error.message || error);
          setIsSkipAvailable(true);
        }
      });
  };

  const handleAdShow = () => {
    if (import.meta.env.DEV) {
      fetchSkipRollTime();
      return;
    }
    window.TelegramAdsController.triggerNativeNotification(true)
      .then((result) => {
        console.log(result);
        if (result === "success") {
          setIsSkipAvailable(false);
          fetchSkipRollTime();
        }
      })
      .catch((error) => {
        showError(error);
        console.log(error);
      });
  };

  useEffect(() => {
    if (!isAnimating && rollSuccesfullResponse != null) {
      setLuckyNumber(rollSuccesfullResponse.luckyNumber);
      setTonBalance(rollSuccesfullResponse.tonBalance);
      setIsPushed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnimating]);

  const getRoll = () => {
    if (!isPushed) {
      setIsSkipAvailable(false);
      setIsPushed(true);
      setIsAnimating(true);
      setRollStarted(true);

      api
        .get("/api/roll")
        .then((response) => {
          setRollSuccessfullResponse(response.data);
          checkIsRollAvailable();
        })
        .catch((error) => {
          if (error.response && error.response.status === 429) {
            showError("Попробуйте позже");
          } else {
            showError(error.message || error);
          }
          setRollStarted(false);
          setIsSkipAvailable(false);
          setIsAnimating(false);
        });
    }
  };

  return (
    <div className={styles.rollButton}>
      {!showTimer ? (
        <MainButton disabled={isPushed} onClick={() => getRoll()}>
          ROLL
        </MainButton>
      ) : (
        <MainButton
          onClick={() => handleAdShow()}
          isSecondaryVariant
          disabled={!isSkipAvailable}
        >
          SKIP AD
          <ImageWebp
            srcSet={adIconWebpImg}
            src={adIconImg}
            alt={"ad"}
            className={styles.rollButton__adImg}
          />
        </MainButton>
      )}
    </div>
  );
}
