import clsx from "clsx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../api/axios";
import styles from "./AddChallengeForm.module.scss";
import ArrowBottomIcon from "./icons/Common/ArrowBottomIcon";
import MainButton from "./layout/MainButton/MainButton";
import SecondaryBtn from "./layout/SecondaryBtn/SecondaryBtn";
import { useNotification } from "./useNotification";

const timeOptions = ["10", "20", "30", "40", "50", "60"];

export default function AddChallengeForm({
  currentChallenge,
  challengesConfigs,
  tonBalance,
  setChallenges,
  setTonBalance,
  challengeForRelaunch,
  setChallengeForRelaunch,
  goBack,
}) {
  const { showError, showNotification } = useNotification();
  const [selectedTimes, setSelectedTimes] = useState("10");
  const [challengeName, setChallengeName] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");
  const [challengeLink, setChallengeLink] = useState("");
  const [challengeDoAmount, setChallengeDoAmount] = useState("");
  const [calculateTotalPrice, setCalculateTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [checkLinkResult, setCheckLinkResult] = useState(null);
  const [activeSurfingConfig, setActiveSurfingConfig] = useState(null);
  const { t } = useTranslation();

  const validateForm = () => {
    if (!challengeName.trim()) return false;
    if (!challengeDescription.trim()) return false;
    if (!challengeLink) return false;
    try {
      const url = new URL(challengeLink);
      if (url.protocol !== "https:") return false;
    } catch {
      return false;
    }
    const amount = Number(challengeDoAmount);
    if (!challengeDoAmount || amount <= 0 || !Number.isInteger(amount))
      return false;
    if (checkLinkResult !== true) return false;
    if (tonBalance < calculateTotalPrice) return false;
    return true;
  };

  useEffect(() => {
    setIsFormValid(validateForm());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    challengeName,
    challengeDescription,
    challengeLink,
    challengeDoAmount,
    checkLinkResult,
    tonBalance,
    calculateTotalPrice,
  ]);

  const handleTimesClick = (time) => {
    setSelectedTimes(time);
  };

  useEffect(() => {
    if (challengeForRelaunch && currentChallenge === "surfing") {
      setChallengeName(challengeForRelaunch.name);
      setChallengeDescription(challengeForRelaunch.description);
      setChallengeLink(challengeForRelaunch.link);
      setSelectedTimes(challengeForRelaunch.timeOfExecution.toString());
      setChallengeForRelaunch(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challengeForRelaunch]);

  const handleChallengeNameChange = (e) => {
    let value = e.target.value;
    const maxLength = 21;
    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
      showError(t("addChallengeForm.maxNameLength"));
    }

    setChallengeName(value);
  };

  const handleChallengeDescriptionChange = (e) => {
    let value = e.target.value;
    const maxLength = 40;
    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
      showError(t("addChallengeForm.maxDescriptionLength"));
    }

    setChallengeDescription(value);
  };

  const handleChallengeLinkChange = (e) => {
    let value = e.target.value;
    const maxLength = 100;
    setIsLoading(false);

    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
      showError(t("addChallengeForm.maxLinkLength"));
    }
    if (value.length > 0) {
      try {
        const url = new URL(value);
        if (url.protocol !== "https:") {
          showError(t("addChallengeForm.linkMustStartHttps"));
          return;
        }
      } catch (err) {
        console.info("check lick failed", err);
        showError(t("addChallengeForm.enterValidUrl"));
      }
    }

    setChallengeLink(value);
  };

  const handleChallengeDoAmountChange = (e) => {
    let value = e.target.value;
    if (value === "" || (/^\d+$/.test(value) && Number(value) > 0)) {
      setChallengeDoAmount(value);
    } else {
      showError(t("addChallengeForm.amountPositiveInteger"));
    }
  };

  const titleCurrentChalengeToName = (currentChallenge) => {
    switch (currentChallenge) {
      case "surfing":
        return t("addChallengeForm.surfing");
      case "telegram":
        return t("addChallengeForm.telegram");
      default:
        return t("addChallengeForm.surfing");
    }
  };

  const selectedTimesToDtoArgumen = (activeSurfingConfig) => {
    if (!activeSurfingConfig) return 9999;
    switch (selectedTimes) {
      case "10":
        return activeSurfingConfig.price10Sec;
      case "20":
        return activeSurfingConfig.price20Sec;
      case "30":
        return activeSurfingConfig.price30Sec;
      case "40":
        return activeSurfingConfig.price40Sec;
      case "50":
        return activeSurfingConfig.price50Sec;
      case "60":
        return activeSurfingConfig.price60Sec;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    if (!challengesConfigs?.surfingConfigs) return;
    const activeSurfingConfigRaw = challengesConfigs.surfingConfigs.find(
      (cfg) => cfg.status === "active",
    );
    if (!activeSurfingConfigRaw) return;
    setActiveSurfingConfig(activeSurfingConfigRaw);
    const priceBySelectedTimes = selectedTimesToDtoArgumen(
      activeSurfingConfigRaw,
    );
    let doAmount = Number(challengeDoAmount) || 0;
    setCalculateTotalPrice((priceBySelectedTimes || 0) * doAmount);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTimes, challengeDoAmount, challengesConfigs]);

  const handleCheckLink = () => {
    const maxLength = 100;
    if (challengeLink.length > maxLength) {
      showError(t("addChallengeForm.maxLinkLength"));
      return;
    }
    if (challengeLink.length > 0) {
      try {
        const url = new URL(challengeLink);
        if (url.protocol !== "https:") {
          showError(t("addChallengeForm.linkMustStartHttps"));
          return;
        }
      } catch (err) {
        console.log("check failed", err);
        showError(t("addChallengeForm.enterValidUrl"));
        return;
      }
    } else {
      showError(t("addChallengeForm.enterLink"));
      return;
    }

    setCheckLinkResult(null);
    setIsLoading(true);
    const postData = {
      challengeLink: challengeLink,
    };
    api
      .post("/api/checklink/iframe", postData)
      .then((response) => {
        setCheckLinkResult(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Checklink for iframe error: {}", error);
        setIsLoading(false);
      });
  };

  const handleCreateChallenge = () => {
    setIsLoading(true);

    const postData = {
      challengeName: challengeName,
      challengeDescription: challengeDescription,
      challengeLink: challengeLink,
      selectedTimes: selectedTimes,
      challengeDoAmount: challengeDoAmount,
      challengeType: currentChallenge,
      configId: activeSurfingConfig.id,
    };
    api
      .post("/api/challenges", postData)
      .then((response) => {
        setChallenges(response.data);
        setTonBalance(response.data.tonBalance);
        setIsLoading(false);
        setChallengeName("");
        setChallengeDescription("");
        setChallengeLink("");
        setSelectedTimes("10");
        setChallengeDoAmount("");
        setCheckLinkResult(null);
        showNotification(t("addChallengeForm.challengeSentForModeration"));
      })
      .catch((error) => {
        console.log("Error creating challenge: {}", error);
        showError(t("addChallengeForm.failedToCreate"));
        setIsLoading(false);
      });
  };

  const renderCheckLinkResult = () => {
    if (checkLinkResult === null) {
      return;
    }
    return checkLinkResult ? (
      <div
        className={clsx(
          styles.addChallengeForm__checkLickResult,
          styles.addChallengeForm__checkLickResult_success,
        )}
      >
        {t("addChallengeForm.linkAvailableForEmbedding")}
      </div>
    ) : (
      <div
        className={clsx(
          styles.addChallengeForm__checkLickResult,
          styles.addChallengeForm__checkLickResult_fail,
        )}
      >
        {t("addChallengeForm.cantAddThisLink")}
      </div>
    );
  };

  return (
    <section className={clsx(styles.addChallengeForm, "container")}>
      <div className={styles.addChallengeForm__header}>
        <div className={styles.addChallengeForm__heraderCol}>
          <button onClick={goBack} className={styles.addChallengeForm__backBtn}>
            <ArrowBottomIcon className={styles.addChallengeForm__arrowIcon} />
          </button>
        </div>
        <h2 className={styles.addChallengeForm__titleText}>
          {" "}
          {t("addChallengeForm.createChallenge")}{" "}
          {titleCurrentChalengeToName(currentChallenge)}
        </h2>
        <div className={styles.addChallengeForm__heraderCol}></div>
      </div>

      <form
        onSubmit={handleCreateChallenge}
        className={styles.addChallengeForm__form}
      >
        <div className={styles.addChallengeForm__field}>
          <label htmlFor={"name"} className={styles.addChallengeForm__label}>
            {t("addChallengeForm.namePlaceholder")}
          </label>
          <input
            id={"name"}
            type={"text"}
            className={styles.addChallengeForm__input}
            name={"name"}
            onChange={handleChallengeNameChange}
            value={challengeName}
          />
        </div>
        <div className={styles.addChallengeForm__field}>
          <label
            htmlFor={"description"}
            className={styles.addChallengeForm__label}
          >
            {t("addChallengeForm.descriptionPlaceholder")}
          </label>
          <textarea
            id={"description"}
            type={"text"}
            className={clsx(
              styles.addChallengeForm__input,
              styles.addChallengeForm__input_textarea,
            )}
            name={"description"}
            onChange={handleChallengeDescriptionChange}
            value={challengeDescription}
          />
        </div>
        <div className={styles.addChallengeForm__field}>
          <label htmlFor={"link"} className={styles.addChallengeForm__label}>
            {t("addChallengeForm.linkPlaceholder")}
          </label>
          <input
            id={"link"}
            type={"text"}
            className={styles.addChallengeForm__input}
            name={"link"}
            onChange={handleChallengeLinkChange}
            value={challengeLink}
          />
        </div>
        <div className={styles.addChallengeForm__checkAddress}>
          <span>{t("addChallengeForm.checkWebsiteStep")}</span>
          <MainButton
            type="button"
            onClick={handleCheckLink}
            disabled={isLoading}
            size="sm"
          >
            {t("addChallengeForm.checkSite")}
          </MainButton>
          {renderCheckLinkResult()}
        </div>
        <div className={styles.addChallengeForm__timeOptions}>
          <h6 className={styles.addChallengeForm__label}>
            {t("addChallengeForm.timeOnSiteTitle")}
          </h6>
          <div className={styles.addChallengeForm__timeOptionsList}>
            {timeOptions.map((opt) => (
              <button
                type="button"
                key={opt}
                className={clsx(
                  styles.addChallengeForm__timeOptionBtn,
                  selectedTimes === opt &&
                    styles.addChallengeForm__timeOptionBtn_active,
                )}
                onClick={() => handleTimesClick(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.addChallengeForm__field}>
          <label htmlFor={"amount"} className={styles.addChallengeForm__label}>
            {t("addChallengeForm.doAmountPlaceholder")}
          </label>
          <input
            id={"amount"}
            type={"text"}
            className={styles.addChallengeForm__input}
            name={"amount"}
            onChange={handleChallengeDoAmountChange}
            value={challengeDoAmount}
          />
        </div>
        <div
          className={clsx(
            styles.addChallengeForm__toPay,
            tonBalance < calculateTotalPrice &&
              styles.addChallengeForm__toPay_invalid,
          )}
        >
          <span className={styles.addChallengeForm__label}>
            {t("addChallengeForm.toPay")}
          </span>
          <span className={styles.addChallengeForm__toPayValueText}>
            {calculateTotalPrice.toFixed(6)}
          </span>
        </div>
        <SecondaryBtn
          disabled={
            isLoading || tonBalance < calculateTotalPrice || !isFormValid
          }
          isSecondaryVariant
        >
          {" "}
          {t("addChallengeForm.launchChallenge")}
        </SecondaryBtn>
      </form>
    </section>
  );
}
