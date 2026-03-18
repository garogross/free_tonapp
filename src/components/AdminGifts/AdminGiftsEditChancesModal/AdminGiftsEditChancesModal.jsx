import { api } from "@/api/axios";
import { closeIconImg, closeIconWebpImg } from "@/assets/images";
import { AnimatePresence, motion as Motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import ImageWebp from "../../layout/ImageWebp/ImageWebp";
import SecondaryBtn from "../../layout/SecondaryBtn/SecondaryBtn";
import { useNotification } from "../../useNotification";
import styles from "./AdminGiftsEditChancesModal.module.scss";

const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const AdminGiftsEditChancesModal = ({
  show,
  onClose,
  giftId,
  giftDropChance,
  giftDemoDropChance,
  gifDisplayChance,
}) => {
  const { showError, showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [dropChanceValue, setDropChanceValue] = useState(giftDropChance);
  const [demoDropChanceValue, setDemoDropChanceValue] =
    useState(giftDemoDropChance);
  const [displayChanceValue, setDisplayChanceValue] =
    useState(gifDisplayChance);

  useEffect(() => {
    setDropChanceValue(giftDropChance);
  }, [giftDropChance]);

  useEffect(() => {
    setDemoDropChanceValue(giftDemoDropChance);
  }, [giftDemoDropChance]);

  useEffect(() => {
    setDisplayChanceValue(gifDisplayChance);
  }, [gifDisplayChance]);

  async function changeChances() {
    if (!giftId) return;
    setLoading(true);
    api
      .post("/api/freetonadmin/gifts/chances", {
        giftId,
        dropChance: +dropChanceValue,
        demoDropChance: +demoDropChanceValue,
        displayChance: +displayChanceValue,
      })
      .then(() => {
        showNotification("Шансы обновлены");
        onClose({
          dropChance: +dropChanceValue,
          demoDropChance: +demoDropChanceValue,
          displayChance: +displayChanceValue,
        });
      })
      .catch((error) => {
        console.error(error);
        showError("Произашла ошбка при запросе");
      })
      .finally(() => setLoading(false));
  }

  return (
    <AnimatePresence>
      {show && (
        <>
          <Motion.div
            className={styles.adminGiftsEditChancesModal__bakcDrop}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.15 }}
            onClick={() => onClose()}
            style={{ zIndex: 1100 }}
          />
          <Motion.div
            className={styles.adminGiftsEditChancesModal__main}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.22 }}
            style={{ zIndex: 1200, position: "fixed" }}
          >
            <button
              className={styles.adminGiftsEditChancesModal__closeBtn}
              onClick={() => onClose()}
              aria-label="Закрыть"
              type="button"
              disabled={loading}
            >
              <ImageWebp
                srcSet={closeIconWebpImg}
                src={closeIconImg}
                alt={"close"}
              />
            </button>
            <div className={styles.adminGiftsEditChancesModal__inputWrapper}>
              <label
                htmlFor="chance"
                type="number"
                className={styles.adminGiftsEditChancesModal__label}
              >
                Шанс
              </label>
              <input
                type="number"
                value={dropChanceValue}
                onChange={(e) => setDropChanceValue(e.target.value)}
                className={styles.adminGiftsEditChancesModal__input}
                disabled={loading}
              />
            </div>
            <div className={styles.adminGiftsEditChancesModal__inputWrapper}>
              <label
                htmlFor="chance"
                className={styles.adminGiftsEditChancesModal__label}
              >
                Шанс на демо
              </label>
              <input
                type="text"
                value={demoDropChanceValue}
                onChange={(e) => setDemoDropChanceValue(e.target.value)}
                className={styles.adminGiftsEditChancesModal__input}
                disabled={loading}
              />
            </div>
            <div className={styles.adminGiftsEditChancesModal__inputWrapper}>
              <label
                htmlFor="display-chance"
                className={styles.adminGiftsEditChancesModal__label}
              >
                Шанс fake
              </label>
              <input
                type="number"
                value={displayChanceValue}
                onChange={(e) => setDisplayChanceValue(e.target.value)}
                className={styles.adminGiftsEditChancesModal__input}
                disabled={loading}
              />
            </div>
            <SecondaryBtn onClick={changeChances} disabled={loading}>
              Сохранить
            </SecondaryBtn>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdminGiftsEditChancesModal;
