import { openLink } from "@telegram-apps/sdk";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { adBannerImg, adBannerWebpImg } from "../assets/images";
import "./Add.css";
import ImageWebp from "./layout/ImageWebp/ImageWebp";

export default function Add({
  setCurrentContent,
  setProfileSubMenu,
  activeAds,
}) {
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

  if (!activeAds || activeAds.length === 0) {
    return (
      <div>
        <ImageWebp
          src={adBannerImg}
          srcSet={adBannerWebpImg}
          style={{ width: "100%" }}
        />
      </div>
    );
  }

  const currentAd = activeAds[currentIndex];

  return (
    <div className="add-container" onClick={handleAdClick}>
      <div className="add-text">{currentAd.adText}</div>
      <div className="add-actions">
        <button
          className="add-ad"
          onClick={(e) => {
            e.stopPropagation();
            followToAdCabinet();
          }}
        >
          {t("adButtonText")}
        </button>
        <button className="add-button">
          {currentAd.adButtonText || t("adDefaultButton")}
        </button>
      </div>
    </div>
  );
}
