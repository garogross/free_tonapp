import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../api/axios";
import styles from "./AddTelegramChallengeForm.module.scss";
import ArrowBottomIcon from "./icons/Common/ArrowBottomIcon";
import SecondaryBtn from "./layout/SecondaryBtn/SecondaryBtn";
import { useNotification } from "./useNotification";

export default function AddTelegramChallengeForm({
  tonBalance,
  challengesConfigs,
  currentChallenge,
  setTonBalance,
  setChallenges,
  challengeForRelaunch,
  setChallengeForRelaunch,
  goBack,
}) {
  const { showError, showNotification } = useNotification();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("1");
  const dropdownRef = useRef(null);
  const [challengeName, setChallengeName] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");
  const [challengeLink, setChallengeLink] = useState("");
  const [challengeDoAmount, setChallengeDoAmount] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [channelId, setChannelId] = useState("");
  const [calculateTotalPrice, setCalculateTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTelegramChallengesConfig, setActiveTelegramChallengesConfig] =
    useState(null);
  const [checkChannelIdResult, setCheckChannelIdResult] = useState(null);
  const { t } = useTranslation();

  const validateForm = () => {
    if (!challengeName.trim()) return false;
    if (!challengeDescription.trim()) return false;
    if (!challengeLink) return false;
    try {
      const url = new URL(challengeLink);
      if (url.protocol !== "https:") return false;
      const hostname = url.hostname.toLowerCase();
      if (
        hostname !== "t.me" &&
        hostname !== "telegram.me" &&
        hostname !== "www.t.me" &&
        hostname !== "www.telegram.me"
      )
        return false;
    } catch {
      return false;
    }
    const amount = Number(challengeDoAmount);
    if (!challengeDoAmount || amount <= 0 || !Number.isInteger(amount))
      return false;
    if (checkChannelIdResult !== true) return false;
    if (tonBalance < calculateTotalPrice) return false;
    if (!channelId.startsWith("-100")) return false;
    return true;
  };

  useEffect(() => {
    if (challengeForRelaunch && currentChallenge === "telegram") {
      setSelectedType(challengeForRelaunch.selectedType);
      setChallengeName(challengeForRelaunch.name);
      setChallengeDescription(challengeForRelaunch.description);
      setChallengeLink(challengeForRelaunch.link);
      setChannelId(challengeForRelaunch.channelId);
      setChallengeForRelaunch(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challengeForRelaunch]);

  useEffect(() => {
    setIsFormValid(validateForm());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    challengeName,
    challengeDescription,
    challengeLink,
    challengeDoAmount,
    checkChannelIdResult,
    tonBalance,
    calculateTotalPrice,
    channelId,
  ]);

  const copyTelegramUsername = (telegramUsername) => {
    navigator.clipboard.writeText(telegramUsername);
    showNotification(t("addTelegramChallengeForm.usernameCopied"), 2000);
  };

  const handleChannleIdChange = (e) => {
    let value = e.target.value;
    const maxLength = 20;
    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
      showError(t("addTelegramChallengeForm.maxIdLength"));
    }

    if (!value.startsWith("-100")) {
      showError(t("addTelegramChallengeForm.idMustStart"));
    }
    setChannelId(value);
    setCheckChannelIdResult(null);
  };

  const handleChallengeDoAmountChange = (e) => {
    let value = e.target.value;
    if (value === "" || (/^\d+$/.test(value) && Number(value) > 0)) {
      setChallengeDoAmount(value);
    } else {
      showError(t("addChallengeForm.amountPositiveInteger"));
    }
  };

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

    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
      showError(t("addChallengeForm.maxLinkLength"));
    }
    if (value.length > 0) {
      try {
        const url = new URL(value);
        if (url.protocol !== "https:") {
          showError(t("addChallengeForm.linkMustStartHttps"));
        }
        const hostname = url.hostname.toLowerCase();
        if (
          hostname !== "t.me" &&
          hostname !== "telegram.me" &&
          hostname !== "www.t.me" &&
          hostname !== "www.telegram.me"
        ) {
          showError(t("addTelegramChallengeForm.linkMustBeTelegram"));
        }
        // eslint-disable-next-line no-unused-vars
      } catch (_) {
        showError(t("addChallengeForm.enterValidUrl"));
      }
    }

    setChallengeLink(value);
  };

  const handleCheckLink = () => {
    setIsLoading(true);
    setCheckChannelIdResult(null);
    const maxLength = 20;
    if (channelId.length > maxLength) {
      showError(t("addTelegramChallengeForm.maxIdLength"));
      setIsLoading(false);
      return;
    }

    if (!channelId.startsWith("-100")) {
      showError(t("addTelegramChallengeForm.idMustStart"));
      setIsLoading(false);
      return;
    }

    const postData = {
      channelId: channelId,
    };

    api
      .post("/api/checkchannelid", postData)
      .then((response) => {
        setCheckChannelIdResult(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Check channel id error: {}", error);
        setIsLoading(false);
      });
  };

  const selectedTimesToDtoArgument = (activeTelegramChallegeConfig) => {
    switch (selectedType) {
      case "1":
        return activeTelegramChallegeConfig.followPrice;
      case "2":
        return activeTelegramChallegeConfig.viewPrice;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    if (!challengesConfigs?.telegramChallengesConfig) return;
    const activeTelegramChallengesConfigRaw =
      challengesConfigs.telegramChallengesConfig.find(
        (cfg) => cfg.status === "active",
      );
    if (!activeTelegramChallengesConfigRaw) return;
    setActiveTelegramChallengesConfig(activeTelegramChallengesConfigRaw);
    const priceBySelectedType = selectedTimesToDtoArgument(
      activeTelegramChallengesConfigRaw,
    );
    let doAmount = Number(challengeDoAmount) || 0;
    setCalculateTotalPrice((priceBySelectedType || 0) * doAmount);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challengeDoAmount, challengesConfigs, selectedType]);

  const options = [
    { value: "1", label: t("addTelegramChallengeForm.subscription") },
    { value: "2", label: t("addTelegramChallengeForm.view") },
  ];

  const selectedOption = options.find((opt) => opt.value === selectedType);

  const handleCreateChallenge = () => {
    setIsLoading(true);

    const postData = {
      challengeName: challengeName,
      challengeDescription: challengeDescription,
      challengeLink: challengeLink,
      channelId: channelId,
      selectedType: selectedType,
      challengeDoAmount: challengeDoAmount,
      challengeType: currentChallenge,
      configId: activeTelegramChallengesConfig.id,
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
        setSelectedType("1");
        setChannelId("");
        setChallengeDoAmount("");
        setCheckChannelIdResult(null);
        showNotification(
          t("addTelegramChallengeForm.challengeSentForModeration"),
        );
      })
      .catch((error) => {
        console.log("Error creating challenge: {}", error);
        showError(t("addTelegramChallengeForm.failedToCreate"));
        setIsLoading(false);
      });
  };

  const renderCheckChannleIdResult = () => {
    if (checkChannelIdResult === null) {
      return;
    }
    return checkChannelIdResult ? (
      <div className={styles["addTalegramChallengeForm__checkLinkResultYes"]}>
        {t("addTelegramChallengeForm.channelAvailable")}
      </div>
    ) : (
      <div className={styles["addTalegramChallengeForm__checkLinkResultNo"]}>
        {t("addTelegramChallengeForm.cantAddThisChannel")}
      </div>
    );
  };

  return (
    <div className={clsx(styles["addTalegramChallengeForm"], "container")}>
      <div className={styles.addTalegramChallengeForm__header}>
        <div className={styles.addTalegramChallengeForm__heraderCol}>
          <button
            onClick={goBack}
            className={styles.addTalegramChallengeForm__backBtn}
          >
            <ArrowBottomIcon
              className={styles.addTalegramChallengeForm__arrowIcon}
            />
          </button>
        </div>
        <h2 className={styles.addTalegramChallengeForm__titleText}>
          {t("addTelegramChallengeForm.createChallengeTelegram")}
        </h2>
        <div className={styles.addTalegramChallengeForm__heraderCol}></div>
      </div>

      <div className={styles["addTalegramChallengeForm__inputContainer"]}>
        <div className={styles["addTalegramChallengeForm__selectorContainer"]}>
          <div
            className={`${styles["addTalegramChallengeForm__selectContainer"]} ${isDropdownOpen ? styles["addTalegramChallengeForm__selectContainerOpen"] : ""}`}
            ref={dropdownRef}
          >
            <div
              className={styles["addTalegramChallengeForm__select"]}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{selectedOption?.label}</span>
            </div>
            {isDropdownOpen && (
              <div className={styles["addTalegramChallengeForm__options"]}>
                {options.map((option) => (
                  <div
                    key={option.value}
                    className={styles["addTalegramChallengeForm__option"]}
                    onClick={() => {
                      setSelectedType(option.value);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <input
          className={styles["addTalegramChallengeForm__input"]}
          type="text"
          placeholder={t("addChallengeForm.namePlaceholder")}
          onChange={handleChallengeNameChange}
          value={challengeName}
        />
        <textarea
          className={styles["addTalegramChallengeForm__input"]}
          type="text"
          placeholder={t("addChallengeForm.descriptionPlaceholder")}
          onChange={handleChallengeDescriptionChange}
          value={challengeDescription}
        />
        <input
          className={styles["addTalegramChallengeForm__input"]}
          type="text"
          placeholder={t("addChallengeForm.linkPlaceholder")}
          onChange={handleChallengeLinkChange}
          value={challengeLink}
        />
        <div className={styles["addTalegramChallengeForm__inputFormInfo"]}>
          {t("addTelegramChallengeForm.onlyPublicChannels")}
        </div>
        <input
          className={styles["addTalegramChallengeForm__input"]}
          type="text"
          placeholder={t("addTelegramChallengeForm.channelIdPlaceholder")}
          onChange={handleChannleIdChange}
          value={channelId}
        />
        <div className={styles["addTalegramChallengeForm__inputFormInfo"]}>
          {t("addTelegramChallengeForm.channelIdExample")}
        </div>
        <input
          className={styles["addTalegramChallengeForm__input"]}
          type="text"
          placeholder={t("addChallengeForm.doAmountPlaceholder")}
          onChange={handleChallengeDoAmountChange}
          value={challengeDoAmount}
        />
      </div>
      <div className={styles["addTalegramChallengeForm__info"]}>
        <div className={styles["addTalegramChallengeForm__descInfo"]}>
          {t("addTelegramChallengeForm.botAdminInfo")}
        </div>
        <div>
          <div
            className={styles["addTalegramChallengeForm__usernameText"]}
            onClick={() => copyTelegramUsername("@Freetoon_bot")}
          >
            @Freetoon_bot
          </div>
          <div className={styles["addTalegramChallengeForm__descInfo"]}>
            {t("addTelegramChallengeForm.clickToCopy")}
          </div>
        </div>
        <button
          className={styles["addTalegramChallengeForm__pingCheckButton"]}
          onClick={handleCheckLink}
          disabled={isLoading}
        >
          {t("challengeButtonCheck")}
        </button>
        {renderCheckChannleIdResult()}
      </div>
      <div className={styles["addTalegramChallengeForm__totalPriceContainer"]}>
        <div className={styles["addTalegramChallengeForm__totalPriceTitle"]}>
          {t("addChallengeForm.toPay")}:
        </div>
        <div
          className={
            tonBalance < calculateTotalPrice
              ? styles["addTalegramChallengeForm__totalPriceRed"]
              : styles["addTalegramChallengeForm__totalPriceGreen"]
          }
        >
          {calculateTotalPrice.toFixed(6)}
        </div>
      </div>
      <div className={styles["addTalegramChallengeForm__buttonContainer"]}>
        <SecondaryBtn
          isSecondaryVariant
          disabled={
            isLoading || tonBalance < calculateTotalPrice || !isFormValid
          }
          onClick={handleCreateChallenge}
        >
          {t("addChallengeForm.launchChallenge")}
        </SecondaryBtn>
      </div>
    </div>
  );
}
