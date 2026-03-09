import { openLink } from "@telegram-apps/sdk";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./AdBanner.module.scss";

const AdBanner = ({ setCurrentContent, setProfileSubMenu, activeAds }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!activeAds || activeAds.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % activeAds.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [activeAds]);

  const followToAdCabinet = () => {
    setCurrentContent("profile");
    setProfileSubMenu("advertising");
  };

  const handleAdClick = () => {
    if (!activeAds || activeAds.length === 0) return;

    const adLink = activeAds[currentIndex].adLink;
    if (openLink.isAvailable()) {
      openLink(adLink);
    }
  };

  const currentAd = activeAds?.[currentIndex];

  return (
    <div className={styles.adBanner}>
      <div className={styles.adBanner__main}>
        <h4 className={styles.adBanner__text}>
          {currentAd?.adText || t("adOfAd")}
        </h4>
        {currentAd && (
          <button onClick={handleAdClick} className={styles.adBanner__openBtn}>
            {currentAd?.adButtonText || t("adDefaultButton")}
          </button>
        )}
      </div>

      <button onClick={followToAdCabinet} className={styles.adBanner__buyAdBtn}>
        AD
      </button>
    </div>
  );
};

export default AdBanner;
