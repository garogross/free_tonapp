import { openLink } from "@telegram-apps/sdk";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { starImg, starWebpImg } from "../assets/images";
import styles from "./AdvertisingCabinet.module.scss";
import ImageWebp from "./layout/ImageWebp/ImageWebp";
import SecondaryBtn from "./layout/SecondaryBtn/SecondaryBtn";

export default function AdvertisingCabinet({
  setCurrentContent,
  tonBalance,
  adPackages,
  course,
  starsMode,
  advertisements,
}) {
  const { t } = useTranslation();

  const handleDemoAdClick = (adLink) => {
    if (openLink.isAvailable()) {
      openLink(adLink);
    }
  };

  const calculateDeadline = (adPackageName, moderatedAt, adPackages) => {
    const pkg = adPackages.find((p) => p.adPackageName === adPackageName);
    if (!pkg || !moderatedAt) return null;
    const startDate = new Date(moderatedAt);
    startDate.setDate(startDate.getDate() + pkg.adDays);
    return startDate.toLocaleString("ru-RU", { hour12: false });
  };

  const getStatusMeaning = (status) => {
    if (status === "moderation") {
      return t("status.moderation").toLowerCase();
    }
    if (status === "active") {
      return t("status.active").toLowerCase();
    }
    if (status === "deprecated") {
      return t("status.deprecated").toLowerCase();
    }
    if (status === "deny") {
      return t("status.deny").toLowerCase();
    }
  };

  const renderAdvertisementsTable = () => {
    if (!advertisements || advertisements.length === 0) {
      return (
        <div className={styles.advertisingCabinet__emptyWrapper}>
          <div className={styles.advertisingCabinet__emptyMessage}>
            {t("emptyList")}
          </div>
        </div>
      );
    }

    return advertisements.map((ad, index) => (
      <div
        className={styles.advertisingCabinet__adContainer}
        key={ad.id || index}
        onClick={() => handleDemoAdClick(ad.adLink)}
      >
        <div className={styles.advertisingCabinet__adCreativeWrapper}>
          <h6 className={styles.advertisingCabinet__adText}>{ad.adText}</h6>
          <div className={styles.advertisingCabinet__adCreativeWrapperMain}>
            <div className={styles.advertisingCabinet__adCreativeInfo}>
              <div className={styles.advertisingCabinet__adInfo}>
                <strong>
                  {t("advertisingCabinet.package")}: {ad.adPackageName}
                </strong>
              </div>
              <div className={styles.advertisingCabinet__adInfo}>
                <strong>{t("advertisingCabinet.creationDate")}: </strong>
                {new Date(ad.createdAt).toLocaleString("ru-RU", {
                  hour12: false,
                })}
              </div>
              <div className={styles.advertisingCabinet__adInfo}>
                <strong>{t("advertisingCabinet.status")}: </strong>
                <span className={styles[`advertisingCabinet__${ad.status}`]}>
                  {getStatusMeaning(ad.status).toUpperCase()}
                </span>
              </div>
              {ad.status === "active" && (
                <div className={styles.advertisingCabinet__adInfo}>
                  {t("advertisingCabinet.showEnds")}:{" "}
                  {calculateDeadline(
                    ad.adPackageName,
                    ad.moderatedAt,
                    adPackages,
                  )}
                </div>
              )}
            </div>
            <div className={styles.advertisingCabinet__adActions}>
              <SecondaryBtn
                size="sm"
                className={styles.advertisingCabinet__adBtnMain}
              >
                {t("adButtonText")}
              </SecondaryBtn>
              <SecondaryBtn
                isSecondaryVariant
                size="sm"
                className={styles.advertisingCabinet__adBtnAlt}
              >
                {ad.adButtonText}
              </SecondaryBtn>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className={clsx(styles.advertisingCabinet, "container")}>
      <div className={styles.advertisingCabinet__container}>
        <div className={styles.advertisingCabinet__balanceTitle}>
          {t("yourBalanceTitle")}
        </div>
        <div className={styles.advertisingCabinet__balanceContainer}>
          <div className={styles.advertisingCabinet__balanceValue}>
            {starsMode
              ? (tonBalance * course).toFixed(6)
              : tonBalance.toFixed(6)}
          </div>
          <div className={styles.advertisingCabinet__balanceIcon}>
            <ImageWebp
              src={starImg}
              srcWebp={starWebpImg}
              alt="stars"
              className={styles.advertisingCabinet__starSwitchIcon}
            />
          </div>
        </div>

        <div className={styles.advertisingCabinet__adsList}>
          {renderAdvertisementsTable()}
        </div>
      </div>
      <SecondaryBtn
        className={styles.advertisingCabinet__buyAdBtn}
        onClick={() => setCurrentContent("addPackagesForm")}
      >
        {t("advertisingCabinet.buyAd")}
      </SecondaryBtn>
    </div>
  );
}
