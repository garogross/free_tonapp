import { closeIconImg, closeIconWebpImg } from "@/assets/images";
import clsx from "clsx";
import { AnimatePresence, motion as Motion } from "framer-motion";
import React from "react";
import { useTranslation } from "react-i18next";
import CopyIcon from "../icons/Common/CopyIcon";
import ImageWebp from "../layout/ImageWebp/ImageWebp";
import SecondaryBtn from "../layout/SecondaryBtn/SecondaryBtn";
import styles from "./MiningSpeedInfoModal.module.scss";

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

const MiningSpeedInfoModal = ({
  show,
  onClose,
  amountsByType,
  selectedAccelerator,
  acceleratorsConfig,
  counter,
  modalPage,
  acceleratorsStatus,
  isAcceleratorsLoading,
  spinner,
  accelerateSpeed,
  course,
  friends,
  writeLinkInClipboard,
  handleSetSelectedAccelerator,
  handleDecrement,
  handleIncrement,
  tonBalance,
  rentMiner,
  acceleratorsList,
  setModalPage,
}) => {
  const { t } = useTranslation();

  const rentCount = 5 - amountsByType[selectedAccelerator];
  const totalRentPrice =
    acceleratorsConfig[selectedAccelerator]?.rentPrice * counter;
  const totalPerDay =
    acceleratorsConfig[selectedAccelerator]?.profitPerDay * counter;
  const totalProfit = Math.ceil(
    acceleratorsConfig[selectedAccelerator]?.profitPerDay *
      acceleratorsConfig[selectedAccelerator]?.rentPeriod *
      counter,
  );

  const renderActiveAcceleratorsList = () => {
    if (!acceleratorsList || acceleratorsList.length === 0) {
      return (
        <div className={styles.miningSpeedInfoModal__emptyWrapper}>
          <div className={styles.miningSpeedInfoModal__emptyMessage}>
            {t("emptyList")}
          </div>
        </div>
      );
    }

    const now = new Date();

    const activeAccelerators = acceleratorsList.filter(
      (acc) => new Date(acc.stopDate) > now,
    );

    if (activeAccelerators.length === 0) {
      return (
        <div className={styles.miningSpeedInfoModal__emptyWrapper}>
          <div className={styles.miningSpeedInfoModal__emptyMessage}>
            {t("emptyList")}
          </div>
        </div>
      );
    }

    const acceleratorTypeInfo = [
      {
        title: "CORE I-9",
        data: acceleratorsConfig[0],
        iconType: 0,
      },
      {
        title: "RTX 4090",
        data: acceleratorsConfig[1],
        iconType: 1,
      },
      {
        title: "A100 GPU",
        data: acceleratorsConfig[2],
        iconType: 2,
      },
    ];

    const calculateRealtimeIncome = (stopDateStr, periodDays, incomePerDay) => {
      const stopDate = new Date(stopDateStr);
      const startDate = new Date(stopDate);
      startDate.setDate(stopDate.getDate() - periodDays);

      const secondsPassed = Math.min(
        (now - startDate) / 1000,
        periodDays * 24 * 3600,
      );
      const incomePerSecond = incomePerDay / (24 * 3600);
      return incomePerSecond * secondsPassed;
    };

    const declOfNum = (number) => {
      const n = Math.abs(number) % 100;
      const n1 = n % 10;
      if (n > 10 && n < 20) return t("stakingForm.daysPlural");
      if (n1 > 1 && n1 < 5) return t("stakingForm.daysGenitiveSingular");
      if (n1 === 1) return t("stakingForm.daySingular");
      return t("stakingForm.daysPlural");
    };

    return (
      <div className={styles.miningSpeedInfoModal__activeList}>
        {activeAccelerators.map((acc) => {
          const stopDateObj = new Date(acc.stopDate);
          const daysLeft = Math.ceil(
            (stopDateObj - now) / (1000 * 60 * 60 * 24),
          );

          const typeInfo = acceleratorTypeInfo[acc.type] || {
            title: t("stakingForm.unknownType"),
            data: {},
            iconType: 0,
          };

          const { rentPeriod, profitPerDay } = typeInfo.data || {
            rentPeriod: 30,
            profitPerDay: 0,
          };

          const realtimeIncome = calculateRealtimeIncome(
            acc.stopDate,
            +rentPeriod,
            +profitPerDay,
          );

          const iconClass =
            typeInfo.iconType === 0
              ? styles.miningSpeedInfoModal__acceleratorIcon1
              : typeInfo.iconType === 1
                ? styles.miningSpeedInfoModal__acceleratorIcon2
                : styles.miningSpeedInfoModal__acceleratorIcon3;

          return (
            <div
              key={acc.id}
              className={styles.miningSpeedInfoModal__activeItem}
            >
              <div className={iconClass} />
              <div className={styles.miningSpeedInfoModal__activeDetails}>
                <div className={styles.miningSpeedInfoModal__activeTitle}>
                  {typeInfo.title}
                </div>
                <div className={styles.miningSpeedInfoModal__activeStopDate}>
                  {t("stakingForm.daysLeft")}: {daysLeft} {declOfNum(daysLeft)}
                </div>
                <div className={styles.miningSpeedInfoModal__activeIncome}>
                  {t("stakingForm.totalMined")}: {realtimeIncome.toFixed(6)}{" "}
                  Stars
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <Motion.div
            className={styles.miningSpeedInfoModal__bakcDrop}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.15 }}
            onClick={onClose}
            style={{ zIndex: 1100 }}
          />
          <Motion.div
            className={styles.miningSpeedInfoModal__main}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.22 }}
            style={{ zIndex: 1200, position: "fixed" }}
          >
            <button
              className={styles.miningSpeedInfoModal__closeBtn}
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
            {acceleratorsStatus && (
              <div className={styles.miningSpeedInfoModal__header}>
                <SecondaryBtn
                  isSecondaryVariant
                  size="sm"
                  className={clsx(
                    modalPage === "accelerators" &&
                      styles.miningSpeedInfoModal__btn_active,
                  )}
                  onClick={() => setModalPage && setModalPage("accelerators")}
                >
                  {t("stakingForm.accelerators")}
                </SecondaryBtn>
                <SecondaryBtn
                  isSecondaryVariant
                  size="sm"
                  className={clsx(
                    modalPage === "store" &&
                      styles.miningSpeedInfoModal__btn_active,
                  )}
                  onClick={() => setModalPage && setModalPage("store")}
                >
                  {t("stakingForm.buy")}
                </SecondaryBtn>
              </div>
            )}
            {!acceleratorsStatus ? (
              <>
                <h3 className={styles.miningSpeedInfoModal__title}>
                  {t("acceleratorsBlocked.friendsInfo", {
                    amount: 0.00000024,
                    mode: "stars",
                  })}
                </h3>
                <p className={styles.miningSpeedInfoModal__mainText}>
                  {t("acceleratorsBlocked.subFriendsInfo")}
                </p>
                <div className={styles.miningSpeedInfoModal__infoBlock}>
                  <span className={styles.miningSpeedInfoModal__infoBlockText}>
                    {t("acceleratorsBlocked.profitPerSecond")}
                  </span>
                  <span className={styles.miningSpeedInfoModal__infoBlockText}>
                    {isAcceleratorsLoading
                      ? spinner
                      : `${(accelerateSpeed * course).toFixed(8)} STARS`}{" "}
                  </span>
                </div>
                <div className={styles.miningSpeedInfoModal__infoBlock}>
                  <span className={styles.miningSpeedInfoModal__infoBlockText}>
                    {t("stakingForm.profitPerDay")}
                  </span>
                  <span className={styles.miningSpeedInfoModal__infoBlockText}>
                    {isAcceleratorsLoading
                      ? spinner
                      : `${(accelerateSpeed * 86400 * course).toFixed(4)} STARS`}
                  </span>
                </div>
                <div className={styles.miningSpeedInfoModal__infoBlock}>
                  <span className={styles.miningSpeedInfoModal__infoBlockText}>
                    {t("friends.friendAmount")}{" "}
                  </span>
                  <span className={styles.miningSpeedInfoModal__infoBlockText}>
                    {isAcceleratorsLoading
                      ? spinner
                      : `${friends.filter((friend) => friend.status === "active").length}`}
                  </span>
                </div>
                <SecondaryBtn onClick={writeLinkInClipboard}>
                  <span> {t("friends.copyLink")}</span>
                  <CopyIcon className={styles.miningSpeedInfoModal__copyIcon} />
                </SecondaryBtn>
              </>
            ) : modalPage === "store" ? (
              <>
                <div
                  className={styles.miningSpeedInfoModal__acceleratorsContainer}
                >
                  <div
                    className={clsx(
                      styles.miningSpeedInfoModal__acceleratorItem,
                      selectedAccelerator === 0 &&
                        styles.miningSpeedInfoModal__acceleratorItem_active,
                    )}
                    onClick={() => handleSetSelectedAccelerator(0)}
                  >
                    <div
                      className={
                        styles.miningSpeedInfoModal__acceleratorItemTitle
                      }
                    >
                      CORE I-9
                    </div>
                    <div
                      className={styles.miningSpeedInfoModal__acceleratorIcon1}
                    />
                    <div
                      className={
                        styles.miningSpeedInfoModal__acceleratorItemDescription
                      }
                    >
                      {(acceleratorsConfig[0]?.profitPerDay / 0.0864).toFixed(
                        1,
                      )}{" "}
                      mkT/s
                    </div>
                  </div>
                  <div
                    className={clsx(
                      styles.miningSpeedInfoModal__acceleratorItem,
                      selectedAccelerator === 1 &&
                        styles.miningSpeedInfoModal__acceleratorItem_active,
                    )}
                    onClick={() => handleSetSelectedAccelerator(1)}
                  >
                    <div
                      className={
                        styles.miningSpeedInfoModal__acceleratorItemTitle
                      }
                    >
                      RTX 4090
                    </div>
                    <div
                      className={styles.miningSpeedInfoModal__acceleratorIcon2}
                    />
                    <div
                      className={
                        styles.miningSpeedInfoModal__acceleratorItemDescription
                      }
                    >
                      {(acceleratorsConfig[1]?.profitPerDay / 0.0864).toFixed(
                        1,
                      )}{" "}
                      mkT/s
                    </div>
                  </div>
                  <div
                    className={clsx(
                      styles.miningSpeedInfoModal__acceleratorItem,
                      selectedAccelerator === 2 &&
                        styles.miningSpeedInfoModal__acceleratorItem_active,
                    )}
                    onClick={() => handleSetSelectedAccelerator(2)}
                  >
                    <div
                      className={
                        styles.miningSpeedInfoModal__acceleratorItemTitle
                      }
                    >
                      A100 GPU
                    </div>
                    <div
                      className={styles.miningSpeedInfoModal__acceleratorIcon3}
                    />
                    <div
                      className={
                        styles.miningSpeedInfoModal__acceleratorItemDescription
                      }
                    >
                      {(acceleratorsConfig[2]?.profitPerDay / 0.0864).toFixed(
                        1,
                      )}{" "}
                      mkT/s
                    </div>
                  </div>
                </div>
                <div
                  className={styles.miningSpeedInfoModal__rentPeriodContainer}
                >
                  <div className={styles.miningSpeedInfoModal__rentPeriodTitle}>
                    {t("stakingForm.rentPeriod")}:
                  </div>
                  <div
                    className={
                      styles.miningSpeedInfoModal__rentPeriodDescription
                    }
                  >
                    {isAcceleratorsLoading
                      ? spinner
                      : `${acceleratorsConfig[selectedAccelerator]?.rentPeriod} ${t(
                          "stakingForm.daysPlural",
                        )}`}
                  </div>
                </div>
                <div className={styles.miningSpeedInfoModal__perDayContainer}>
                  <div className={styles.miningSpeedInfoModal__perDayTitle}>
                    {t("stakingForm.profitPerDay")}:
                  </div>
                  <div
                    className={styles.miningSpeedInfoModal__perDayDescription}
                  >
                    {isAcceleratorsLoading ? spinner : `${totalPerDay} Stars`}
                  </div>
                </div>
                <div
                  className={styles.miningSpeedInfoModal__totalProfitContainer}
                >
                  <div
                    className={styles.miningSpeedInfoModal__totalProfitTitle}
                  >
                    {t("stakingForm.totalProfit")}:
                  </div>
                  <div
                    className={
                      styles.miningSpeedInfoModal__totalProfitDescription
                    }
                  >
                    {isAcceleratorsLoading ? spinner : `${totalProfit} Stars`}
                  </div>
                </div>
                <div className={styles.miningSpeedInfoModal__counterTitle}>
                  {t("stakingForm.totalCount")}
                </div>
                <div className={styles.miningSpeedInfoModal__counterContainer}>
                  <div
                    className={styles.miningSpeedInfoModal__counterButtonMinus}
                    onClick={handleDecrement}
                  >
                    -
                  </div>
                  <div className={styles.miningSpeedInfoModal__counterValue}>
                    {isAcceleratorsLoading ? spinner : counter}
                  </div>
                  <div
                    className={styles.miningSpeedInfoModal__counterButtonPlus}
                    onClick={handleIncrement}
                  >
                    +
                  </div>
                </div>
                <div
                  className={
                    styles.miningSpeedInfoModal__totalRentPriceContainer
                  }
                >
                  <div
                    className={styles.miningSpeedInfoModal__totalRentPriceTitle}
                  >
                    {t("stakingForm.rentPrice")}
                  </div>
                  <div
                    className={
                      styles.miningSpeedInfoModal__totalRentPriceDescription
                    }
                  >
                    {isAcceleratorsLoading
                      ? spinner
                      : `${totalRentPrice} Stars`}
                  </div>
                </div>
                <button
                  className={clsx(
                    styles.miningSpeedInfoModal__rentButton,
                    (isAcceleratorsLoading ||
                      totalRentPrice > tonBalance ||
                      rentCount === 0) &&
                      styles.miningSpeedInfoModal__rentButton_disabled,
                  )}
                  onClick={() =>
                    rentMiner(
                      rentCount,
                      selectedAccelerator,
                      isAcceleratorsLoading,
                      totalRentPrice,
                      amountsByType[selectedAccelerator],
                    )
                  }
                >
                  {t("stakingForm.rentMiner")}
                </button>
              </>
            ) : (
              renderActiveAcceleratorsList()
            )}
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MiningSpeedInfoModal;
