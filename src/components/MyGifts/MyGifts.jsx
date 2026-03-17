import { api } from "@/api/axios";
import { starImg, starWebpImg } from "@/assets/images";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ImageWebp from "../layout/ImageWebp/ImageWebp";
import MainButton from "../layout/MainButton/MainButton";
import { useNotification } from "../useNotification";
import styles from "./MyGifts.module.scss";

// Button label based on status, using translation keys from myGifts: toStars/convertedBtn/withdrawnBtn
const getBtnStatusText = (status, t) => {
  switch (status) {
    case "held":
      return t("myGifts.toStars");
    case "converted":
      return t("myGifts.convertedBtn");
    case "withdrawn":
      return t("myGifts.withdrawnBtn");
    default:
      return t("myGifts.toStars");
  }
};

// Tab label based on status, using translation keys from myGifts: held/converted/withdrawn
const getTabStatusText = (status, t) => {
  switch (status) {
    case "held":
      return t("myGifts.held");
    case "converted":
      return t("myGifts.converted");
    case "withdrawn":
      return t("myGifts.withdrawn");
    default:
      return t("myGifts.toStars");
  }
};

const statuses = ["held", "converted", "withdrawn"];

const MyGifts = ({ getMyGifts, myGifts, setMyGifts, setTonBalance }) => {
  const { t } = useTranslation();
  const { showNotification, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(statuses[0]);

  async function convert(userGiftId) {
    setLoading(true);
    api
      .post("/api/gifts/convert", {
        userGiftId,
      })
      .then((response) => {
        setMyGifts((prev) => prev.filter((item) => item.id !== userGiftId));
        setTonBalance((prev) => prev + response.data.convertValue);
        showNotification(
          t("starsCredited", { balance: response.data.convertValue }),
        );
      })
      .catch((error) => {
        console.error(error);
        showError(t("notification.requestError"));
      })
      .finally(() => setLoading(false));
  }

  async function withdraw(userGiftId) {
    setLoading(true);
    api
      .post("/api/gifts/withdraw", {
        userGiftId,
      })
      .then(() => {
        setMyGifts((prev) => prev.filter((item) => item.id !== userGiftId));
        showNotification(t("gift.withdrawRequestSent"));
      })
      .catch((error) => {
        console.error(error);
        showError(t("notification.requestError"));
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    getMyGifts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredGifts = myGifts.filter((gift) => gift.status === currentTab);

  return (
    <section className={clsx(styles.myGifts, "container")}>
      <h3 className={styles.myGifts__title}>{t("myGifts.title")}</h3>
      <div className={styles.myGifts__tabBar}>
        {statuses.map((status) => (
          <button
            key={status}
            disabled={loading}
            className={clsx(
              styles.myGifts__tabBarBtn,
              currentTab === status && styles.myGifts__tabBarBtn_active,
            )}
            onClick={() => {
              setCurrentTab(status);
            }}
          >
            <span>{getTabStatusText(status, t)}</span>
          </button>
        ))}
      </div>
      {!filteredGifts.length ? (
        <p className={styles.myGifts__messageText}>{t("gift.noGifts")}</p>
      ) : (
        <div className={styles.myGifts__list}>
          {filteredGifts.map((gift) => (
            <div key={gift.id} className={styles.myGifts__item}>
              <ImageWebp
                src={`/images/gifts/${gift.giftImageUrl}.png`}
                srcSet={`/images/gifts/${gift.giftImageUrl}.webp`}
                alt="gift"
                className={styles.myGifts__img}
              />
              <p className={styles.myGifts__starsText}>
                {gift.convertValue}
                <ImageWebp src={starImg} srcSet={starWebpImg} alt="star" />
              </p>
              <MainButton
                disabled={loading || gift.status !== "held"}
                onClick={() => convert(gift.id)}
                className={styles.myGifts__btn}
                size="sm"
              >
                {getBtnStatusText(gift.status, t)}
              </MainButton>
              {gift.status === "held" && (
                <MainButton
                  disabled={loading}
                  className={styles.myGifts__btn}
                  isSecondaryVariant
                  onClick={() => withdraw(gift.id)}
                  size="sm"
                >
                  {t("myGifts.withdraw")}
                </MainButton>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyGifts;
