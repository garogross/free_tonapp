import { AnimatePresence, motion as Motion } from "framer-motion";
import React, { useState } from "react";

import { api } from "@/api/axios";
import { closeIconImg, closeIconWebpImg } from "@/assets/images";
import { invoice } from "@telegram-apps/sdk";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { starImg, starWebpImg } from "../../../assets/images";
import ImageWebp from "../../layout/ImageWebp/ImageWebp";
import MainButton from "../../layout/MainButton/MainButton";
import SecondaryBtn from "../../layout/SecondaryBtn/SecondaryBtn";
import { useNotification } from "../../useNotification";
import styles from "./ProfileDepositModal.module.scss";

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

const options = [100, 200, 300];

const ProfileDepositModal = ({ show, onClose, getTonBalance }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState(options[0]);
  const [loading, setLoading] = useState(false);
  const { showError, showNotification } = useNotification();

  const handleCreateInvoice = async () => {
    try {
      setLoading(true);
      const res = await api.post("/api/deposit/create-invoice", {
        starsAmount: amount,
      });

      if (res.data?.invoiceUrl) {
        if (invoice.isSupported()) {
          try {
            // open() returns a promise that resolves with the payment status
            // 'url' is the mode used for full invoice links
            const status = await invoice.open(res.data?.invoiceUrl, "url");

            if (status === "paid") {
              getTonBalance();
              showNotification(t("profileDeposit.success"));
              // Update your UI here
            } else {
              console.log("Payment status:", status); // 'cancelled', 'failed', etc.
            }
          } catch (error) {
            console.error("Invoice failed to open:", error);
            showError(t("profileDeposit.failToOpenInvoice"));
          } finally {
            setLoading(false);
          }
        } else {
          showError(t("profileDeposit.notSupported"));
        }
      }
    } catch (error) {
      console.error(error);
      showError(t("profileDeposit.failToCreateInvoice"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <Motion.div
            className={styles.profileDepositModal__bakcDrop}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.15 }}
            onClick={onClose}
            style={{ zIndex: 1100 }}
          />
          <Motion.div
            className={styles.profileDepositModal__main}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.22 }}
            style={{ zIndex: 1200, position: "fixed" }}
          >
            <button
              className={styles.profileDepositModal__closeBtn}
              onClick={onClose}
              aria-label={t("common.close", "Закрыть")}
              type="button"
            >
              <ImageWebp
                srcSet={closeIconWebpImg}
                src={closeIconImg}
                alt={"close"}
              />
            </button>
            <h3 className={styles.profileDepositModal__titleText}>
              {t("profileDeposit.title")}
            </h3>
            <h6 className={styles.profileDepositModal__selectedValueText}>
              {+amount}
              <ImageWebp src={starImg} srcSet={starWebpImg} alt="stars" />
            </h6>
            <div className={styles.profileDepositModal__options}>
              {options.map((opt) => (
                <SecondaryBtn
                  size="md"
                  key={opt}
                  isSecondaryVariant
                  onClick={() => setAmount(opt)}
                  className={clsx(
                    styles.profileDepositModal__optionBtn,
                    opt === +amount &&
                      styles.profileDepositModal__optionBtn_active,
                  )}
                >
                  {opt}
                  <ImageWebp src={starImg} srcSet={starWebpImg} alt="stars" />
                </SecondaryBtn>
              ))}
            </div>
            <input
              type="number"
              className={clsx(
                styles.profileDepositModal__input,
                !amount && styles.profileDepositModal__input_invalid,
              )}
              placeholder={t("profileDeposit.inputPlaceholder")}
              value={amount.toString()}
              onChange={(e) => setAmount(e.target.value)}
            />
            <MainButton
              disabled={loading || !amount}
              onClick={handleCreateInvoice}
            >
              {loading ? (
                <span className={styles.profileDepositModal__loader}></span>
              ) : (
                t("profileDeposit.button")
              )}
            </MainButton>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfileDepositModal;
