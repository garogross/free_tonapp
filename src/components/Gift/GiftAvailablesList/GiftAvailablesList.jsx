import React from "react";
import { useTranslation } from "react-i18next";
import {
  chanceDiceiconImg,
  chanceDiceiconWebpImg,
  starImg,
  starWebpImg,
} from "../../../assets/images";
import ImageWebp from "../../layout/ImageWebp/ImageWebp";
import MainButton from "../../layout/MainButton/MainButton";
import styles from "./GiftAvailablesList.module.scss";

const GiftAvailablesList = ({ setCurrentContent, gifts }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.giftAvailablesList}>
      <h4 className={styles.giftAvailablesList__titleText}>
        {t("gift.availableGiftsTitle")}
      </h4>
      <div className={styles.giftAvailablesList__main}>
        <div className={styles.giftAvailablesList__items}>
          {gifts.map((gift) => (
            <div key={gift.id} className={styles.giftAvailablesList__item}>
              <p className={styles.giftAvailablesList__itemChanceText}>
                {gift.dropChance}%
                <ImageWebp
                  src={chanceDiceiconImg}
                  srcSet={chanceDiceiconWebpImg}
                  alt="dice"
                />
              </p>
              <ImageWebp
                src={`/images/gifts/${gift.imageUrl}.png`}
                srcSet={`/images/gifts/${gift.imageUrl}.webp`}
                alt="gift"
                className={styles.giftAvailablesList__itemImg}
              />
              <p className={styles.giftAvailablesList__starsText}>
                {gift.convertValue}
                <ImageWebp src={starImg} srcSet={starWebpImg} alt="star" />
              </p>
            </div>
          ))}
        </div>
      </div>
      <MainButton
        onClick={() => setCurrentContent("myGifts")}
        isSecondaryVariant
        className={styles.giftAvailablesList__myGiftsBtn}
      >
        {t("gift.myGiftsBtn")}
      </MainButton>
    </div>
  );
};

export default GiftAvailablesList;
