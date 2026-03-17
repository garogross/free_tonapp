import { api } from "@/api/axios";
import { starImg, starWebpImg } from "@/assets/images";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ImageWebp from "../layout/ImageWebp/ImageWebp";
import MainButton from "../layout/MainButton/MainButton";
import { useNotification } from "../useNotification";
import styles from "./MyGifts.module.scss";

const MyGifts = ({ getMyGifts, myGifts, setMyGifts, setTonBalance }) => {
  const { t } = useTranslation();
  const { showNotification, showError } = useNotification();
  const [loading, setLoading] = useState(false);

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

  const filteredGifts = myGifts.filter((gift) => gift.status === "held");
  return (
    <section className={clsx(styles.myGifts, "container")}>
      <h3 className={styles.myGifts__title}>My Gifts</h3>
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
                disabled={loading}
                onClick={() => convert(gift.id)}
                className={styles.myGifts__btn}
                size="sm"
              >
                To Stars
              </MainButton>
              <MainButton
                disabled={loading}
                className={styles.myGifts__btn}
                isSecondaryVariant
                onClick={() => withdraw(gift.id)}
                size="sm"
              >
                Withdraw
              </MainButton>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyGifts;
