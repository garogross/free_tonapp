import { AnimatePresence, motion as Motion } from "framer-motion";
import React, { useState } from "react";

import { api } from "@/api/axios";
import { closeIconImg, closeIconWebpImg } from "@/assets/images";
import { openInvoice } from "@telegram-apps/sdk";
import clsx from "clsx";
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
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [loading, setLoading] = useState(false);
  const { showError, setNotifications } = useNotification();

  const handleCreateInvoice = async () => {
    try {
      setLoading(true);
      const res = await api.post("/api/deposit/create-invoice", {
        starsAmount: selectedOption,
      });
      if (res.data?.invoiceUrl) {
        openInvoice(res.data?.invoiceUrl, (status) => {
          if (status === "paid") {
            // The payment was successful
            getTonBalance();
            setNotifications("Success! Your stars have been added.");
          } else if (status === "cancelled") {
            // User closed the payment window without paying
            console.log("Payment was cancelled by the user.");
          } else if (status === "failed") {
            // Something went wrong (e.g., insufficient funds or network error)
            showError("Payment failed. Please try again.");
          } else {
            // Unknown status or 'pending' (rare for Stars)
            console.log("Payment status:", status);
          }
        });
      }
    } catch (error) {
      console.error(error);
      showError("failed to create invoice");
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
              aria-label="Закрыть"
              type="button"
            >
              <ImageWebp
                srcSet={closeIconWebpImg}
                src={closeIconImg}
                alt={"close"}
              />
            </button>
            <h3 className={styles.profileDepositModal__titleText}>
              Пополнить Баланс
            </h3>
            <h6 className={styles.profileDepositModal__selectedValueText}>
              {selectedOption}
              <ImageWebp src={starImg} srcSet={starWebpImg} alt="stars" />
            </h6>
            <div className={styles.profileDepositModal__options}>
              {options.map((opt) => (
                <SecondaryBtn
                  size="md"
                  key={opt}
                  isSecondaryVariant
                  onClick={() => setSelectedOption(opt)}
                  className={clsx(
                    styles.profileDepositModal__optionBtn,
                    opt === selectedOption &&
                      styles.profileDepositModal__optionBtn_active,
                  )}
                >
                  {opt}
                  <ImageWebp src={starImg} srcSet={starWebpImg} alt="stars" />
                </SecondaryBtn>
              ))}
            </div>
            <MainButton disabled={loading} onClick={handleCreateInvoice}>
              {loading ? (
                <span className={styles.profileDepositModal__loader}></span>
              ) : (
                "Пополнить"
              )}
            </MainButton>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfileDepositModal;
