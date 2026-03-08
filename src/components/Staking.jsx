import { retrieveLaunchParams } from "@telegram-apps/sdk";
import { clsx } from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../api/axios";
import {
  miningInfoIconImg,
  miningInfoIconWebpImg,
  miningReadyMinerImg,
  miningReadyMinerWebpImg,
  miningSpeedIconImg,
  miningSpeedIconWebpImg,
  starImg,
  starWebpImg,
} from "../assets/images";
import ChannelFollow from "./ChannelFollow";
import ImageWebp from "./layout/ImageWebp/ImageWebp";
import MainButton from "./layout/MainButton/MainButton";
import MiningSpeedInfoModal from "./MiningSpeedInfoModal/MiningSpeedInfoModal";
import styles from "./Staking.module.scss";
import { useNotification } from "./useNotification";

export default function Staking({
  setTonBalance,
  tonBalance,
  accelerateBalance,
  accelerateSpeed,
  setAccelerateBalance,
  setAccelerateSpeed,
  friends,
  acceleratorsStatus,
  setAcceleratorsStatus,
  setIsSubscriber,
  isSubscriber,
  starsMode,
  course,
}) {
  const [counter, setCounter] = useState(1);
  const [selectedAccelerator, setSelectedAccelerator] = useState(0);
  const [showAccelerateModal, setShowAccelerateModal] = useState(false);
  const [amountsByType, setAmountsByType] = useState([0, 0, 0]);
  const [isAcceleratorsLoading, setIsAcceleratorsLoading] = useState(false);
  const [modalPage, setModalPage] = useState("accelerators");
  const [acceleratorsConfig, setAcceleratorsConfig] = useState([]);
  const [acceleratorsList, setAcceleratorsList] = useState([]);

  const { showError, showNotification } = useNotification();

  let initData;
  try {
    initData = retrieveLaunchParams();
  } catch (error) {
    console.error("Error retrieving launch params:", error);
    initData = null;
  }
  const userId = initData?.tgWebAppData.user.id;
  const { t } = useTranslation();

  const writeLinkInClipboard = () => {
    navigator.clipboard.writeText("https://t.me/Freetoon_bot?start=" + userId);
    showNotification(t("friends.linkCopied"), 1000);
  };

  const getUnfund = () => {
    if (accelerateBalance >= 0.5) {
      api
        .get("/api/accelerateunfund")
        .then((response) => {
          setTonBalance(response.data.tonBalance);
          setAccelerateBalance(response.data.accelerateBalance);
          setAccelerateSpeed(response.data.accelerateSpeed);
        })
        .catch((error) => {
          console.error("Unfund accelerate balance error: ", error);
        });
    } else {
      showError(
        starsMode
          ? t("stakingForm.requestWithdrawMin", {
              amount: 0.5 * course,
              mode: "stars",
            })
          : t("stakingForm.requestWithdrawMin", { amount: "0.5", mode: "TON" }),
      );
    }
  };

  const rentMiner = (
    rentCount,
    selectedAccelerator,
    isAcceleratorsLoading,
    totalRentPrice,
    amountBuyedAccelerators,
  ) => {
    if (
      !(isAcceleratorsLoading || totalRentPrice > tonBalance || rentCount === 0)
    ) {
      setIsAcceleratorsLoading(true);
      const postData = {
        rentCount: rentCount,
        type: selectedAccelerator,
      };

      api
        .post("/api/accelerators", postData)
        .then((response) => {
          setCounter(1);
          setAmountsByType(response.data.amountsByType);
          setAcceleratorsList(response.data.accelerators);
          setIsAcceleratorsLoading(false);
          setTonBalance(response.data.tonBalance);
          function getAccelerateBalance() {
            api
              .get("/api/acceleratebalance")
              .then((response) => {
                setAccelerateBalance(response.data.accelerateBalance);
                setAccelerateSpeed(response.data.accelerateSpeed);
                showNotification(t("stakingForm.rentSuccess"));
              })
              .catch((error) => {
                console.error("Getting accelerate balance error: ", error);
              });
          }
          getAccelerateBalance();
        })
        .catch((error) => {
          console.error("Rent accelerators error: ", error);
          showError(t("Rent accelerators error"));
          setIsAcceleratorsLoading(false);
        });
    } else {
      if (amountBuyedAccelerators === 5) {
        showError(t("stakingForm.maxFiveAccelerators"));
      } else {
        showError(t("stakingForm.insufficientFunds"));
      }
    }
  };

  const handleAccelerate = () => {
    console.log("handleAccelerate");

    setIsAcceleratorsLoading(true);
    setShowAccelerateModal(true);

    api
      .get("/api/accelerators")
      .then((response) => {
        if (response.data.acceleratorsConfig[0].acceleratorsStatus) {
          setAmountsByType(response.data.amountsByType);
          setAcceleratorsList(response.data.accelerators);
        }
        setAcceleratorsStatus(
          response.data.acceleratorsConfig[0].acceleratorsStatus,
        );
        setAcceleratorsConfig(response.data.acceleratorsConfig);
        setIsAcceleratorsLoading(false);
      })
      .catch((error) => {
        console.error("Get accelerators error: ", error);
        showError("Get accelerators error");
        setIsAcceleratorsLoading(false);
      });
  };

  const handleSetSelectedAccelerator = (idx) => {
    setCounter(1);
    setSelectedAccelerator(idx);
  };

  const closeAccelerateModal = () => {
    setShowAccelerateModal(false);
    setModalPage("accelerators");
    setSelectedAccelerator(0);
  };

  const handleDecrement = () => {
    if (counter > 1) {
      setCounter(counter - 1);
    }
  };

  const handleIncrement = () => {
    if (counter < 5 - amountsByType[selectedAccelerator]) {
      setCounter(counter + 1);
    } else {
      showError(t("stakingForm.maxFiveAccelerators"));
    }
  };

  const showStakingInfo = (e) => {
    console.log("showStakingInfo");

    e.stopPropagation();
    if (acceleratorsStatus) {
      showNotification(t("stakingForm.offlineMiningInfo"));
    } else {
      showNotification(t("stakingForm.offlineMiningInfoAcBlocked"));
    }
  };

  const spinner = <span className={styles.staking__loader}></span>;

  return (
    <>
      <section className={clsx(styles.staking, "container")}>
        <div className={styles.staking}>
          <ImageWebp
            src={miningReadyMinerImg}
            srcSet={miningReadyMinerWebpImg}
            alt="miner"
            className={styles.staking__img}
          />
          <div className={styles.staking__collectBar}>
            <div className={styles.staking__collectText}>
              <span> {(accelerateBalance * course).toFixed(8)}</span>
              <ImageWebp
                src={starImg}
                srcSet={starWebpImg}
                alt="star"
                className={styles.staking__collectStarImg}
              />
            </div>
            <MainButton onClick={getUnfund}>
              {t("stakingForm.request")}
            </MainButton>
          </div>
          <button
            onClick={handleAccelerate}
            className={styles.staking__speedBar}
          >
            <div className={styles.staking__speedBarBg}></div>
            <ImageWebp
              src={miningSpeedIconImg}
              srcSet={miningSpeedIconWebpImg}
              alt="speed"
              className={styles.staking__speedIconImg}
            />
            <span className={styles.staking__speedText}>
              {t("stakingForm.speed")}:{" "}
              {starsMode
                ? (accelerateSpeed * course).toFixed(8)
                : accelerateSpeed.toFixed(8)}{" "}
            </span>
            <button
              onClick={showStakingInfo}
              className={styles.staking__infoBtn}
            >
              <ImageWebp
                src={miningInfoIconImg}
                srcSet={miningInfoIconWebpImg}
                alt="info"
                className={styles.staking__infoIconImg}
              />
            </button>
            <div className={styles.staking__offlineMining}>
              <span className={styles.staking__offlineMiningNameText}>
                Offline Mining:{" "}
              </span>
              <span className={styles.staking__offlineMiningValueText}>
                06:00
              </span>
            </div>
          </button>
          <MiningSpeedInfoModal
            show={showAccelerateModal}
            onClose={closeAccelerateModal}
            amountsByType={amountsByType}
            selectedAccelerator={selectedAccelerator}
            acceleratorsConfig={acceleratorsConfig}
            counter={counter}
            modalPage={modalPage}
            acceleratorsStatus={acceleratorsStatus}
            isAcceleratorsLoading={isAcceleratorsLoading}
            spinner={spinner}
            accelerateSpeed={accelerateSpeed}
            course={course}
            friends={friends}
            writeLinkInClipboard={writeLinkInClipboard}
            handleSetSelectedAccelerator={handleSetSelectedAccelerator}
            handleDecrement={handleDecrement}
            handleIncrement={handleIncrement}
            tonBalance={tonBalance}
            rentMiner={rentMiner}
            acceleratorsList={acceleratorsList}
            setModalPage={setModalPage}
          />
        </div>
      </section>
      ;
      {!isSubscriber && !import.meta.env.DEV && (
        <ChannelFollow setIsSubscriber={setIsSubscriber} />
      )}
    </>
  );
}
