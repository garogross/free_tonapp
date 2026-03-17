import { starImg, starWebpImg } from "@/assets/images";
import clsx from "clsx";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../../api/axios";
import {
  giftRulletIndicatorImg,
  giftRulletIndicatorWebpImg,
} from "../../../assets/images";
import ImageWebp from "../../layout/ImageWebp/ImageWebp";
import MainButton from "../../layout/MainButton/MainButton";
import SwitcherBtn from "../../layout/SwitcherBtn/SwitcherBtn";
import { useNotification } from "../../useNotification";
import styles from "./GiftRullet.module.scss";

const GiftRullet = ({ gifts, getGifts, tonBalance, setTonBalance }) => {
  const { t } = useTranslation();
  const { showNotification, showError } = useNotification();
  const [tier, setTier] = useState(25);
  const [wonGiftId, setWonGiftId] = useState(null);
  const [demoMode, setDemoMode] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [itemWidth, setItemWidth] = useState(0);
  const timeoutRef = useRef(null);
  const listWrapperRef = useRef(null);

  async function spin() {
    if (tonBalance < tier) {
      showError(t("gift.insufficientFunds"));
      return;
    }
    setFetchLoading(true);
    api
      .post("/api/gifts/spin", {
        tier,
        demo: demoMode,
      })
      .then((response) => {
        setWonGiftId(response.data.wonGift.imageUrl);
        if (response.data.newBalance) setTonBalance(response.data.newBalance);
        setAnimating(true);
      })
      .catch((error) => {
        setAnimating(false);
        console.error(error);
        showError(t("notification.requestError"));
      })
      .finally(() => setFetchLoading(false));
  }

  useLayoutEffect(() => {
    const cardItem = listWrapperRef.current?.firstChild;
    const cardItemWidth = cardItem?.getBoundingClientRect()?.width;
    if (cardItemWidth) setItemWidth(cardItemWidth + 6); // 6 is gap
  }, []);

  useEffect(() => {
    let notificationTimeout = null;
    if (animating) {
      notificationTimeout = setTimeout(() => {
        showNotification(`${t("gift.youWon")} ${t(`gift.gifts.${wonGiftId}`)}`);
      }, 6000);
      timeoutRef.current = setTimeout(() => {
        setAnimating(false);
      }, 8000);
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (notificationTimeout) clearTimeout(notificationTimeout);
    }

    return () => {
      clearTimeout(timeoutRef.current);
      clearTimeout(notificationTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animating]);

  const DISPLAYING_GIFTS_ARRAY_REPEAT_COUNT = 5;
  const displayingGifts = Array.from(
    { length: DISPLAYING_GIFTS_ARRAY_REPEAT_COUNT },
    () => gifts,
  ).flat();
  const targetGifts = Array.from(
    { length: DISPLAYING_GIFTS_ARRAY_REPEAT_COUNT - 1 },
    () => gifts,
  ).flat();

  const wonGiftIndex = targetGifts.findLastIndex(
    (gift) => gift.imageUrl === wonGiftId,
  );
  const translateX = animating
    ? `-${(wonGiftIndex === -1 ? displayingGifts.length - 1 : wonGiftIndex - 1) * itemWidth}px`
    : 0;

  return (
    <div className={styles.giftRullet}>
      <div className={styles.giftRullet__starsBar}>
        <button
          disabled={animating || fetchLoading}
          className={clsx(
            styles.giftRullet__starsBarBtn,
            tier === 25 && styles.giftRullet__starsBarBtn_active,
          )}
          onClick={() => {
            setTier(25);

            getGifts(25);
          }}
        >
          25
          <ImageWebp src={starImg} srcSet={starWebpImg} alt="star" />
        </button>
        <button
          disabled={animating || fetchLoading}
          onClick={() => {
            setTier(50);

            getGifts(50);
          }}
          className={clsx(
            styles.giftRullet__starsBarBtn,
            tier === 50 && styles.giftRullet__starsBarBtn_active,
          )}
        >
          50
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
        <div
          className={clsx(
            styles.giftRullet__list,
            animating && styles.giftRullet__list_animating,
          )}
          style={{
            transform: `translateX(${translateX})`,
          }}
          ref={listWrapperRef}
        >
          {displayingGifts.map((gift, index) => (
            <div key={index} className={styles.giftRullet__item}>
              <ImageWebp
                src={`/images/gifts/${gift.imageUrl}.png`}
                srcSet={`/images/gifts/${gift.imageUrl}.webp`}
                alt="gift"
                className={styles.giftRullet__itemImg}
              />
              <p className={styles.giftRullet__itemStarsText}>
                {gift.convertValue}
                <ImageWebp src={starImg} srcSet={starWebpImg} alt="star" />
              </p>
            </div>
          ))}
        </div>
      </div>
      <SwitcherBtn
        label={"Demo Mode"}
        active={demoMode}
        onClick={() => setDemoMode((prev) => !prev)}
      />
      <MainButton
        onClick={spin}
        disabled={fetchLoading || animating}
        className={styles.giftRullet__rollBtn}
      >
        Try Your Luck
      </MainButton>
    </div>
  );
};

export default GiftRullet;
