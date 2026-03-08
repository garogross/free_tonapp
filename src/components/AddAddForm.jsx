import { retrieveRawInitData } from "@telegram-apps/sdk";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../api/axios";
import styles from "./AddAddForm.module.scss";
import { useNotification } from "./useNotification";
export default function AddAddForm({
  selectedPackage,
  setAdvertisements,
  setTonBalance,
  setCurrentContent,
  setProfileSubMenu,
  blockedSlots,
}) {
  const [selectedType, setSelectedType] = useState("1");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { showError, showNotification } = useNotification();
  const [adText, setAdText] = useState("");
  const [adLink, setAdLink] = useState("");
  const [adButtonText, setAdButtonText] = useState("");
  const dropdownRef = useRef(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState(null);
  const [bannerLink, setBannerLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!bannerFile) {
      setBannerPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(bannerFile);
    setBannerPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [bannerFile]);

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/png", "image/jpeg"];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      showError(t("addAddForm.onlyPngJpeg"));
      return;
    }

    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      showError(t("addAddForm.maxFileSize", { size: maxSizeMB }));
      return;
    }

    const img = new Image();
    img.onload = () => {
      const width = img.width;
      const height = img.height;

      const desiredRatio = 480 / 75;
      const actualRatio = width / height;
      const tolerance = 0.5;

      if (Math.abs(actualRatio - desiredRatio) > tolerance) {
        showError(
          t("addAddForm.invalidAspectRatio", {
            ratio: desiredRatio.toFixed(2),
          }),
        );
        return;
      }
      setBannerFile(file);
    };
    img.onerror = () => {
      showError(t("addAddForm.cantLoadImage"));
    };

    img.src = URL.createObjectURL(file);
  };

  const handleAdTextChange = (e) => {
    let value = e.target.value;
    const maxLength = 75;
    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
      showError(t("addAddForm.maxAdTextLength"));
    }
    setAdText(value);
  };

  const handleBannerLinkChange = (e) => {
    let value = e.target.value;
    const maxLength = 100;
    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
      showError(t("addAddForm.maxLinkLength"));
    }
    try {
      if (value.length > 0) new URL(value);
      // eslint-disable-next-line no-unused-vars
    } catch (_) {
      if (value.length > 0) {
        showError(t("addAddForm.enterValidUrl"));
      }
    }
    setBannerLink(value);
  };

  const handleAdLinkChange = (e) => {
    let value = e.target.value;
    const maxLength = 100;
    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
      showError(t("addAddForm.maxLinkLength"));
    }
    try {
      if (value.length > 0) new URL(value);
      // eslint-disable-next-line no-unused-vars
    } catch (_) {
      if (value.length > 0) {
        showError(t("addAddForm.enterValidUrl"));
      }
    }
    setAdLink(value);
  };

  const handleAdButtonTextChange = (e) => {
    let value = e.target.value;
    const maxLength = 15;
    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
      showError(t("addAddForm.maxButtonTextLength"));
    }
    setAdButtonText(value);
  };

  const options = [{ value: "1", label: t("addAddForm.text") }];
  const selectedOption = options.find((opt) => opt.value === selectedType);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const startAdvertisement = (
    adPackageName,
    adText,
    adLink,
    adButtonText,
    blockedSlots,
  ) => {
    if (blockedSlots === 10) {
      showError(t("addAddForm.noFreeSlots"));
      return;
    }
    const formData = new FormData();

    if (selectedType === "1") {
      if (adText.length === 0) {
        showError(t("addAddForm.adTextRequired"));
        return;
      }
      if (adLink.length === 0) {
        showError(t("addAddForm.productLinkRequired"));
        return;
      }
      if (adButtonText.length === 0) {
        showError(t("addAddForm.buttonTextRequired"));
        return;
      }
      try {
        new URL(adLink);
        // eslint-disable-next-line no-unused-vars
      } catch (_) {
        if (adLink.length > 0) {
          showError(t("addAddForm.enterValidUrl"));
          return;
        }
      }
      formData.append("adPackageName", adPackageName);
      formData.append("adText", adText);
      formData.append("adLink", adLink);
      formData.append("adButtonText", adButtonText);
      formData.append("adType", selectedType);
    } else if (selectedType === "2") {
      if (!bannerFile) {
        showError(t("addAddForm.selectBanner"));
        return;
      }
      if (bannerLink.length === 0) {
        showError(t("addAddForm.productLinkRequired"));
        return;
      }
      try {
        new URL(bannerLink);
        // eslint-disable-next-line no-unused-vars
      } catch (_) {
        if (bannerLink.length > 0) {
          showError(t("addAddForm.enterValidUrl"));
          return;
        }
      }
      formData.append("adPackageName", adPackageName);
      formData.append("banner", bannerFile);
      formData.append("bannerLink", bannerLink);
      formData.append("adType", selectedType);
    }
    setIsLoading(true);
    let dataRaw;
    try {
      dataRaw = retrieveRawInitData();
    } catch (error) {
      console.error("Error retrieving raw init data:", error);
      dataRaw = null;
    }
    api
      .post("/api/advertisement", formData, {
        headers: {
          Authorization: "tma " + dataRaw,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setAdvertisements(response.data.advertisements);
        setTonBalance(response.data.tonBalance);
        setCurrentContent("profile");
        setProfileSubMenu("advertising");
        setIsLoading(false);
        showNotification(t("addAddForm.requestSentForModeration"));
      })
      .catch((error) => {
        showError(t("addAddForm.failedToExecute"));
        setIsLoading(false);
        console.error("Post ad error: ", error);
      });
  };

  return (
    <div className={clsx(styles.addAddForm, "container")}>
      <div className={styles.addAddForm__title}>
        {t("addAddForm.adPlacement")}
      </div>
      <div className={styles.addAddForm__description}>
        {t("addAddForm.adApplyDescription")}
      </div>
      <div className={styles.addAddForm__freeSlots}>
        {t("addAddForm.freeSlots", { freeSlots: 10 - blockedSlots })}
      </div>
      <div className={styles.addAddForm__packageInfoTitle}>
        {t("addAddForm.packageInfo")}
      </div>
      <div className={styles.addAddForm__packageInfoContainer}>
        <div className={styles.addAddForm__packageInfoItemTitle}>
          {t("addAddForm.name")}: {selectedPackage?.adPackageName}
        </div>
        <div className={styles.addAddForm__packageInfoItemDescription}>
          {t("addAddForm.days")}: {selectedPackage?.adDays}
        </div>
        <div className={styles.addAddForm__packageInfoItemPriceContainer}>
          <div className={styles.addAddForm__packageInfoItemPrice}>
            {t("addAddForm.price")}: {selectedPackage?.price}
          </div>
          <div className={styles.addAddForm__packageInfoItemPriceIcon}>
            <img src="/assets/ton.svg" alt="TON" />
          </div>
        </div>
      </div>
      <div className={styles.addAddForm__addTitle}>{t("addAddForm.addAd")}</div>
      <div className={styles.addAddForm__addContainer}>
        <div
          className={`${styles.addAddForm__addSelectContainer} ${isDropdownOpen ? styles.open : ""}`}
          ref={dropdownRef}
        >
          <div
            className={styles.addAddForm__addSelect}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>{selectedOption?.label}</span>
          </div>
          {isDropdownOpen && (
            <div className={styles.addAddForm__addOptions}>
              {options.map((option) => (
                <div
                  key={option.value}
                  className={styles.addAddForm__addSelectOption}
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
        {selectedType === "1" ? (
          <>
            <input
              type="text"
              placeholder={t("addAddForm.adTextPlaceholder")}
              className={styles.addAddForm__addInput}
              onChange={handleAdTextChange}
              value={adText}
            />
            <input
              type="text"
              placeholder={t("addAddForm.adLinkPlaceholder")}
              className={styles.addAddForm__addInput}
              onChange={handleAdLinkChange}
              value={adLink}
            />
            <input
              type="text"
              placeholder={t("addAddForm.adButtonTextPlaceholder")}
              className={styles.addAddForm__addInput}
              onChange={handleAdButtonTextChange}
              value={adButtonText}
            />
          </>
        ) : (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className={styles.addAddForm__addInput}
            />
            {bannerFile && (
              <div className={styles.addAddForm__bannerPreviewContainer}>
                <img
                  src={bannerPreviewUrl}
                  alt={t("addAddForm.bannerPreviewAlt")}
                  className={styles.addAddForm__bannerPreview}
                />
              </div>
            )}
            <div className={styles.addAddForm__addBannerDescription}>
              {t("addAddForm.bannerSizeDescription")}
            </div>
            <input
              type="text"
              placeholder={t("addAddForm.bannerLinkPlaceholder")}
              className={styles.addAddForm__addInput}
              onChange={handleBannerLinkChange}
              value={bannerLink}
            />
          </>
        )}
      </div>
      <div className={styles.addAddForm__addButtonContainer}>
        <button
          className={styles.addAddForm__addButton}
          onClick={() =>
            startAdvertisement(
              selectedPackage?.adPackageName,
              adText,
              adLink,
              adButtonText,
              blockedSlots,
            )
          }
          disabled={isLoading}
        >
          {t("addAddForm.launchAd")}
        </button>
      </div>
    </div>
  );
}
