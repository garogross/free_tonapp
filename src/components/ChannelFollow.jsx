import { openTelegramLink, retrieveRawInitData } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./ChannelFollow.css";
import { useNotification } from "./useNotification";

export default function ChannelFollow({ setIsSubscriber }) {
  const { t, i18n } = useTranslation();
  const [isClick, setIsClick] = useState(false);
  const [buttonText, setButtonText] = useState(
    t("subscribtionWindow.buttonText"),
  );
  const [isLoading, setIsLoading] = useState(false);
  const { showError } = useNotification();

  const challengeLink = "https://t.me/communityfreeton";

  function checkSub() {
    setIsLoading(true);
    let dataRaw;
    try {
      dataRaw = retrieveRawInitData();
    } catch (error) {
      console.error("Error retrieving raw init data:", error);
      dataRaw = null;
    }
    api
      .get("/api/check/subscription")
      .then((response) => {
        setIsSubscriber(response.data);
        setIsLoading(false);
        setButtonText(t("subscribtionWindow.buttonText"));
      })
      .catch((error) => {
        showError(t("subscribtionWindow.failedCheck"));
        console.log("error check subscription: {}", error);
        setIsLoading(false);
        setButtonText(t("subscribtionWindow.buttonText"));
      });
  }

  const handleSubscribe = () => {
    if (!isClick) {
      if (openTelegramLink.isAvailable()) {
        openTelegramLink(challengeLink);
        setButtonText(t("subscribtionWindow.checkText"));
      }
    } else {
      checkSub();
    }
    setIsClick(!isClick);
  };

  useEffect(() => {
    if (isClick) {
      setButtonText(t("subscribtionWindow.checkText"));
    } else {
      setButtonText(t("subscribtionWindow.buttonText"));
    }
  }, [i18n.language, isClick, t]);

  return (
    <div className="subscribe-container">
      <div className="subscribe-title">{t("subscribtionWindow.title")}</div>
      <div className="subscribe-sub-title">
        {t("subscribtionWindow.subTitle")
          .split("\n")
          .map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
      </div>
      <button
        className="subscribe-button"
        onClick={handleSubscribe}
        disabled={isLoading}
      >
        {buttonText}
      </button>
    </div>
  );
}
