import { starImg, starWebpImg } from "@/assets/images";
import clsx from "clsx";
import React from "react";
import { GIFTS } from "../../dummyData/gifts";
import ImageWebp from "../layout/ImageWebp/ImageWebp";
import MainButton from "../layout/MainButton/MainButton";
import styles from "./MyGifts.module.scss";

const MyGifts = () => {
  return (
    <section className={clsx(styles.myGifts, "container")}>
      <h3 className={styles.myGifts__title}>My Gifts</h3>
      <div className={styles.myGifts__list}>
        {GIFTS.map((gift) => (
          <div key={gift.id} className={styles.myGifts__item}>
            <ImageWebp
              src={gift.image}
              srcSet={gift.imageWebp}
              alt="gift"
              className={styles.myGifts__img}
            />
            <p className={styles.myGifts__starsText}>
              {gift.stars}
              <ImageWebp src={starImg} srcSet={starWebpImg} alt="star" />
            </p>
            <MainButton className={styles.myGifts__btn} size="sm">
              To Stars
            </MainButton>
            <MainButton
              className={styles.myGifts__btn}
              isSecondaryVariant
              size="sm"
            >
              Withdraw
            </MainButton>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MyGifts;
