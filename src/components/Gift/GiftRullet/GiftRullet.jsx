import { starImg, starWebpImg } from "@/assets/images";
import clsx from "clsx";
import React from "react";
import {
  giftRulletIndicatorImg,
  giftRulletIndicatorWebpImg,
} from "../../../assets/images";
import { GIFTS } from "../../../dummyData/gifts";
import ImageWebp from "../../layout/ImageWebp/ImageWebp";
import MainButton from "../../layout/MainButton/MainButton";
import SwitcherBtn from "../../layout/SwitcherBtn/SwitcherBtn";
import styles from "./GiftRullet.module.scss";

const GiftRullet = () => {
  return (
    <div className={styles.giftRullet}>
      <div className={styles.giftRullet__starsBar}>
        <button className={styles.giftRullet__starsBarBtn}>
          25
          <ImageWebp src={starImg} srcSet={starWebpImg} alt="star" />
        </button>
        <button
          className={clsx(
            styles.giftRullet__starsBarBtn,
            styles.giftRullet__starsBarBtn_active,
          )}
        >
          25
          <ImageWebp src={starImg} srcSet={starWebpImg} alt="star" />
        </button>
      </div>
      <div className={styles.giftRullet__main}>
        <div className={styles.giftRullet__indicator}>
          <ImageWebp
            src={giftRulletIndicatorImg}
            srcSet={giftRulletIndicatorWebpImg}
            alt="indicator"
            pictureClass={styles.giftRullet__indicatorPicture}
            className={styles.giftRullet__indicatorImg}
          />
        </div>
        <div className={styles.giftRullet__list}>
          {GIFTS.map((gift) => (
            <div key={gift.id} className={styles.giftRullet__item}>
              <ImageWebp
                src={gift.image}
                srcSet={gift.imageWebp}
                alt="gift"
                className={styles.giftRullet__itemImg}
              />
              <p className={styles.giftRullet__itemStarsText}>
                {gift.stars}
                <ImageWebp src={starImg} srcSet={starWebpImg} alt="star" />
              </p>
            </div>
          ))}
        </div>
      </div>
      <SwitcherBtn label={"Demo Mode"} />
      <MainButton className={styles.giftRullet__rollBtn}>
        Try Your Luck
      </MainButton>
    </div>
  );
};

export default GiftRullet;
