import { retrieveRawInitData } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";
import { api } from "../api/axios";
import "./RollButton.css";
import { useNotification } from "./useNotification";

export default function RollButton(props) {
  const { showError, showNotification } = useNotification();
  const [rollSuccesfullResponse, setRollSuccessfullResponse] = useState(null);

  const handleAdShow = () => {
    window.TelegramAdsController.triggerNativeNotification(true)
      .then((result) => {
        console.log(result);
        if (result === "success") {
          props.setIsSkipAvailable(false);
          let dataRaw;
          try {
            dataRaw = retrieveRawInitData();
          } catch (error) {
            console.error("Error retrieving raw init data:", error);
            dataRaw = null;
          }
          api
            .get("/api/skiprolltime", {
              headers: {
                Authorization: "tma " + dataRaw,
              },
            })
            .then((res) => {
              props.setIsPushed(!res.data.isAvailable);
              const endDateTime = new Date(res.data.endTime);
              props.setEndTime(endDateTime);
              props.setLastRollNumber(res.data.lastRollNumber);

              const minutesLater = new Date(now.getTime() + 60 * 60 * 1000);
              props.setSkipEndTime(minutesLater);
              props.setIsSkipAvailable(false);
              showNotification("Таймер пропущен", 5000);
            })
            .catch((error) => {
              if (error.response && error.response.status === 429) {
                showError("Попробуйте позже");
                props.setIsSkipAvailable(false);
              } else {
                showError(error.message || error);
                props.setIsSkipAvailable(true);
              }
            });
        }
      })
      .catch((error) => {
        showError(error);
        console.log(error);
      });
  };

  useEffect(() => {
    if (!props.isAnimating && rollSuccesfullResponse != null) {
      props.setLuckyNumber(rollSuccesfullResponse.luckyNumber);
      props.setTonBalance(rollSuccesfullResponse.tonBalance);
      props.setLastRollNumber(rollSuccesfullResponse.luckyNumber);
      props.setIsPushed(true);
    }
  }, [props.isAnimating]);

  const getRoll = () => {
    if (!props.isPushed) {
      props.setIsSkipAvailable(false);
      props.setIsPushed(true);
      props.setIsAnimating(true);
      props.setRollStarted(true);

      let dataRaw;
      try {
        dataRaw = retrieveRawInitData();
      } catch (error) {
        console.error("Error retrieving raw init data:", error);
        dataRaw = null;
      }
      api
        .get("/api/roll")
        .then((response) => {
          setRollSuccessfullResponse(response.data);
          const now = new Date();
          const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
          props.setEndTime(oneHourLater);
          props.setIsSkipAvailable(false);
        })
        .catch((error) => {
          if (error.response && error.response.status === 429) {
            showError("Попробуйте позже");
          } else {
            showError(error.message || error);
          }
          props.setRollStarted(false);
          props.setIsSkipAvailable(false);
          props.setIsAnimating(false);
        });
    }
  };

  return (
    <div className="roller-buttons-container">
      <div class="roll-button-wrapper">
        <button
          className={`roll-button ${props.isPushed ? "pushed" : ""}`}
          onClick={() => getRoll()}
        >
          <span className="roll-button-text">ROLL</span>
          <div
            className={`roll-button-shadow ${props.isPushed ? "pushed" : ""}`}
          ></div>
        </button>
      </div>
      {props.isPushed && props.isSkipAvailable && (
        <div className="roll-button-skip" onClick={() => handleAdShow()}>
          <div className="rollskip-image-container">
            <img
              src={"/images/rollskip.svg"}
              alt="skip"
              className="rollskip-image"
            />
          </div>
        </div>
      )}
    </div>
  );
}
