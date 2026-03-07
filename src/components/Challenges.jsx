import { starImg, starWebpImg } from "@/assets/images";
import { openTelegramLink } from "@telegram-apps/sdk";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../api/axios";
import styles from "./Challenges.module.scss";
import ChannelFollow from "./ChannelFollow";
import ImageWebp from "./layout/ImageWebp/ImageWebp";
import MainButton from "./layout/MainButton/MainButton";
import SecondaryBtn from "./layout/SecondaryBtn/SecondaryBtn";
import SwitcherBtn from "./layout/SwitcherBtn/SwitcherBtn";
import { useNotification } from "./useNotification";
const filters = [
  {
    value: "surfing",
    name: "Серфинг",
  },
  {
    value: "telegram",
    name: "Telegram",
  },
  {
    value: "youtube",
    name: "YouTobe",
  },
  {
    value: "reviews",
    name: "Отзывы",
  },
];

export default function Challenges({
  setCurrentContent,
  currentChallenge,
  setCurrentChallenge,
  challenges,
  setTonBalance,
  setChallenges,
  setCurrentSurfingChallenge,
  setIsSubscriber,
  isSubscriber,
  setChallengeForRelaunch,
  course,
}) {
  const [isClient, setIsClient] = useState(false);
  const [surfingChallenges, setSurfingChallenges] = useState([]);
  const [ownedSurfingChallenges, setOwnedSurfingChallenges] = useState([]);
  const [telegramChallenges, setTelegramChallenges] = useState([]);
  const [ownedTelegramChallenges, setOwnedTelegramChallenges] = useState([]);
  const { showNotification, showError } = useNotification();
  const { t } = useTranslation();

  const handleAdShow = () => {
    window.TelegramAdsController.triggerNativeNotification(true)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        showError(error);
        console.log(error);
      });
  };

  const getTypeButton = (type) => {
    switch (type) {
      case "1":
        return t("challengeButtonCheck");
      case "2":
        return t("challengeButtonIframe");
    }
  };

  const handleTelegramChallengeClick = (challengeLink, type, id) => {
    if (!challengeLink || challengeLink.length === 0) return;

    if (openTelegramLink.isAvailable()) {
      openTelegramLink(challengeLink);
    }
    if (type === "view") {
      const postData = {
        id: id,
      };
      api
        .post("/api/challenge/view", postData)
        .then((response) => {
          setChallenges(response.data);
          setTonBalance(response.data.tonBalance);
          showNotification(t("notification.successfullChallenge"));
        })
        .catch((error) => {
          console.log("error view telegram challenge: {}", error);
          showError(t("notification.failed"));
        });
    }
  };

  useEffect(() => {
    if (!challenges) return;
    setSurfingChallenges(challenges.activeSurfingChalleges);
    setOwnedSurfingChallenges(challenges.ownedSurfingChallenges);
    setTelegramChallenges(challenges.activeTelegramChallenges);
    setOwnedTelegramChallenges(challenges.ownedTelegramChallenges);
  }, [challenges]);

  const handleClientSwitch = () => {
    setIsClient(!isClient);
  };

  const statusToMean = (status) => {
    switch (status) {
      case "moderation":
        return t("status.moderation");
      case "active":
        return t("status.active");
      case "deprecated":
        return t("status.deprecated");
      case "deny":
        return t("status.deny");
    }
  };

  const handleTelegramChallengeCheck = (id) => {
    const postData = {
      id: id,
    };
    api
      .post("/api/challenge/follow", postData)
      .then((response) => {
        setChallenges(response.data);
        setTonBalance(response.data.tonBalance);
        showNotification(t("notification.successfullChallenge"));
      })
      .catch((error) => {
        console.log("error view telegram challenge: {}", error);
        showError(t("notification.failed"));
      });
  };

  const handleSurfingChallengeClick = (sc) => {
    setCurrentSurfingChallenge(sc);
    setCurrentContent("secureIframe");
  };

  const handleRelaunch = (sc) => {
    setChallengeForRelaunch(sc);
    if (currentChallenge === "surfing") {
      setCurrentContent("addChallengeForm");
    } else if (currentChallenge === "telegram") {
      setCurrentContent("addTelegramChallengeForm");
    }
  };

  const renderWillBeSoonBlock = () => (
    <div className={styles.chalanges__messageText}>{t("soonTitle")}</div>
  );

  const renderShowAdChallenge = () => {
    return (
      <div
        className={styles.chalanges__starsInTelegram}
        onClick={() => handleAdShow()}
      >
        <h5 className={styles.chalanges__starsInTelegramText}>
          1000 Stars in Telegram
          <ImageWebp src={starImg} srcSet={starWebpImg} alt="star" />
        </h5>
        <MainButton size="sm">CLAIM</MainButton>
      </div>
    );
  };

  const renderTelegramChallengesTable = () => {
    let table = [];
    switch (isClient) {
      case true:
        table = ownedTelegramChallenges;
        break;
      case false:
        table = telegramChallenges;
        break;
    }
    if (!table || table.length === 0) {
      return (
        <div className={styles.chalanges__messageText}>{t("emptyList")}</div>
      );
    }

    return (
      <div className={styles.chalanges__list}>
        {table.map((sc, index) => {
          return (
            <div key={sc.id || index} className={styles.chalanges__listItem}>
              <div className={styles.chalanges__listItemMain}>
                <h6 className={styles.chalanges__listItemMainTitleText}>
                  {sc.name}
                </h6>
                <p className={styles.chalanges__listItemMainDescriptionText}>
                  {sc.description}
                </p>
                <div className={styles.chalanges__listItemMainFooter}>
                  <p>
                    <span
                      className={styles.chalanges__listItemMainTimeNameText}
                    >
                      {t("timeTitle")}:{" "}
                    </span>
                    <span
                      className={styles.chalanges__listItemMainTimeValueText}
                    >
                      {sc.timeOfExecution} {t("seconds")}
                    </span>
                  </p>
                  <p className={styles.chalanges__listItemPaymentText}>
                    <span className={styles.chalanges__listItemPaymentNameText}>
                      {t("paymentTitle")}:{" "}
                    </span>
                    <span
                      className={styles.chalanges__listItemPaymentValueText}
                    >
                      {(sc.price * course).toFixed(7)}
                    </span>
                    <ImageWebp src={starImg} srcSet={starWebpImg} alt="star" />
                  </p>
                </div>
              </div>
              <div className={styles.chalanges__listItemActions}>
                <span
                  className={clsx(
                    styles.chalanges__listItemStatusText,
                    styles[`chalanges__listItemStatusText_${sc.status}`],
                  )}
                >
                  {isClient ? statusToMean(sc.status) : ""}
                </span>
                {isClient ? (
                  <>
                    <SecondaryBtn
                      className={styles.chalanges__listItemBtn}
                      size="sm"
                      isSecondaryVariant
                      onClick={() => {
                        handleTelegramChallengeClick(sc.link, "view", sc.id);
                      }}
                    >
                      {getTypeButton(sc.selectedType)}
                    </SecondaryBtn>
                  </>
                ) : sc.selectedType === "1" ? (
                  <>
                    <SecondaryBtn
                      className={styles.chalanges__listItemBtn}
                      size="sm"
                      isSecondaryVariant
                      onClick={() => {
                        handleTelegramChallengeCheck(sc.id);
                      }}
                    >
                      {t("challengeButtonCheck")}
                    </SecondaryBtn>
                  </>
                ) : (
                  <>
                    <SecondaryBtn
                      className={styles.chalanges__listItemBtn}
                      size="sm"
                      isSecondaryVariant
                      onClick={() => {
                        handleTelegramChallengeClick(sc.link, "view", sc.id);
                      }}
                    >
                      {t("challengeButtonIframe")}
                    </SecondaryBtn>
                  </>
                )}
                {isClient && sc.status === "deprecated" && (
                  <SecondaryBtn
                    className={styles.chalanges__listItemBtn}
                    size="sm"
                    onClick={() => handleRelaunch(sc)}
                  >
                    {t("restartChallengeButtonText")}
                  </SecondaryBtn>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSurfingChallengesTable = () => {
    let table = [];
    switch (isClient) {
      case true:
        table = ownedSurfingChallenges;
        break;
      case false:
        table = surfingChallenges;
        break;
    }
    if (!table || table.length === 0) {
      return (
        <div className={styles.chalanges__messageText}>{t("emptyList")}</div>
      );
    }
    return (
      <div className={styles.chalanges__list}>
        {table.map((sc, index) => {
          return (
            <div key={sc.id || index} className={styles.chalanges__listItem}>
              <div className={styles.chalanges__listItemMain}>
                <h6 className={styles.chalanges__listItemMainTitleText}>
                  {sc.name}
                </h6>
                <p className={styles.chalanges__listItemMainDescriptionText}>
                  {sc.description}
                </p>
                <div className={styles.chalanges__listItemMainFooter}>
                  <p>
                    <span
                      className={styles.chalanges__listItemMainTimeNameText}
                    >
                      {t("timeTitle")}:{" "}
                    </span>
                    <span
                      className={styles.chalanges__listItemMainTimeValueText}
                    >
                      {sc.timeOfExecution} {t("seconds")}
                    </span>
                  </p>
                  <p className={styles.chalanges__listItemPaymentText}>
                    <span className={styles.chalanges__listItemPaymentNameText}>
                      {t("paymentTitle")}:{" "}
                    </span>
                    <span
                      className={styles.chalanges__listItemPaymentValueText}
                    >
                      {(sc.price * course).toFixed(7)}
                    </span>
                    <ImageWebp src={starImg} srcSet={starWebpImg} alt="star" />
                  </p>
                </div>
              </div>
              <div className={styles.chalanges__listItemActions}>
                <span
                  className={clsx(
                    styles.chalanges__listItemStatusText,
                    styles[`chalanges__listItemStatusText_${sc.status}`],
                  )}
                >
                  {isClient ? statusToMean(sc.status) : ""}
                </span>
                <SecondaryBtn
                  className={styles.chalanges__listItemBtn}
                  size="sm"
                  isSecondaryVariant
                  onClick={
                    isClient
                      ? handleTelegramChallengeClick(sc.link)
                      : handleSurfingChallengeClick(sc)
                  }
                >
                  {t("challengeButtonGoIn")}
                </SecondaryBtn>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderChallenges = () => {
    if (isClient) {
      switch (currentChallenge) {
        case "youtube":
          return renderWillBeSoonBlock();
        case "reviews":
          return renderWillBeSoonBlock();
        case "surfing":
          return (
            <>
              <MainButton
                className={styles.chalanges__addBtn}
                onClick={() => setCurrentContent("addChallengeForm")}
              >
                {t("addChallengeButton")}
              </MainButton>
              {renderSurfingChallengesTable()}
            </>
          );
        case "telegram":
          return (
            <>
              <MainButton
                className={styles.chalanges__addBtn}
                onClick={() => setCurrentContent("addChallengeForm")}
              >
                {t("addChallengeButton")}
              </MainButton>
              {renderTelegramChallengesTable()}
            </>
          );
      }
    } else {
      switch (currentChallenge) {
        case "surfing":
          return (
            <>
              {renderShowAdChallenge()}
              {renderSurfingChallengesTable()}
            </>
          );
        case "telegram":
          return (
            <>
              <div className="no-clients-challenges-title">
                {renderShowAdChallenge()}
              </div>
              <div className="no-clients-challenges-title">
                {renderTelegramChallengesTable()}
              </div>
            </>
          );
        case "youtube":
          return renderWillBeSoonBlock();
        case "reviews":
          return renderWillBeSoonBlock();
      }
    }
  };

  return (
    <>
      <section className={clsx(styles.chalanges, "container")}>
        <SwitcherBtn active={isClient} onClick={handleClientSwitch} />
        <div className={styles.chalanges__filters}>
          {filters.map((item) => (
            <SecondaryBtn
              isSecondaryVariant
              size="sm"
              key={item.value}
              onClick={() => setCurrentChallenge(item.value)}
              className={clsx(
                styles.chalanges__filterBtn,
                item.value === currentChallenge &&
                  styles.chalanges__filterBtn_active,
              )}
            >
              {item.name}
            </SecondaryBtn>
          ))}
        </div>
        {renderChallenges()}
      </section>
      {!isSubscriber && !import.meta.env.DEV && (
        <>
          <ChannelFollow setIsSubscriber={setIsSubscriber} />
        </>
      )}
    </>
  );
}
