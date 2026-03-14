import React from "react";
import {
  chanceDiceiconImg,
  chanceDiceiconWebpImg,
  starImg,
  starWebpImg,
} from "../../../assets/images";
import { GIFTS } from "../../../dummyData/gifts";
import ImageWebp from "../../layout/ImageWebp/ImageWebp";

import MainButton from "../../layout/MainButton/MainButton";
import styles from "./GiftAvailablesList.module.scss";

const GiftAvailablesList = ({ setCurrentContent }) => {
  return (
    <div className={styles.giftAvailablesList}>
      <h4 className={styles.giftAvailablesList__titleText}>Availlable Gifts</h4>
      <div className={styles.giftAvailablesList__main}>
        <div className={styles.giftAvailablesList__items}>
          {GIFTS.map((gift) => (
            <div key={gift.id} className={styles.giftAvailablesList__item}>
              <p className={styles.giftAvailablesList__itemChanceText}>
                {gift.chance}%
                <ImageWebp
                  src={chanceDiceiconImg}
                  srcSet={chanceDiceiconWebpImg}
                  alt="dice"
                />
              </p>
              <ImageWebp
                src={gift.image}
                srcSet={gift.imageWebp}
                alt="gift"
                className={styles.giftAvailablesList__itemImg}
              />
              <p className={styles.giftAvailablesList__starsText}>
                {gift.stars}
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
        My Gifts
      </MainButton>
    </div>
  );
};

export default GiftAvailablesList;
