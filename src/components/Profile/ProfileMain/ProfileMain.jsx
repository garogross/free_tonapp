import { api } from "@/api/axios";
import {
  profileAvatarImg,
  profileAvatarWebpImg,
  profiledepositIconImg,
  profiledepositIconWebpImg,
  profileNotificationsiconImg,
  profileNotificationsiconWebpImg,
  profileWithdrawIconImg,
  profileWithdrawIconWebpImg,
} from "@/assets/images";
import { retrieveLaunchParams } from "@telegram-apps/sdk";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ImageWebp from "../../layout/ImageWebp/ImageWebp";
import SecondaryBtn from "../../layout/SecondaryBtn/SecondaryBtn";
import { useNotification } from "../../useNotification";
import styles from "./ProfileMain.module.scss";

const ProfileMain = ({ setProfileSubMenu, setCurrentContent }) => {
  const { t } = useTranslation();
  const { showError } = useNotification();
  const [walletButton, setWalletButton] = useState(t("rulletConnect"));
  const [payload, setPayload] = useState(null);

  const [proof, setProof] = useState(null);

  const [walletAccount, setWalletAccount] = useState(null);

  const [tonConnectUI] = useTonConnectUI();
  const userFriendlyAddress = useTonAddress();

  useEffect(() => {
    if (!proof || !payload || !userFriendlyAddress) return;

    const sendProof = async () => {
      try {
        const response = await api.post("/api/verify-ton-proof", {
          tonProof: proof,
          walletAccount,
        });

        if (response.status === 200) {
          setWalletButton(t("rulletTopUp"));
          setCurrentContent("cashInRequest");
        } else {
          throw new Error("Proof verification failed");
        }
      } catch (error) {
        showError(
          t("rulletAddressCheckError") +
            ": " +
            (error.response?.data?.error || error.message),
        );
        setWalletButton(t("rulletConnect"));
      }
    };

    sendProof();
  }, [
    proof,
    payload,
    userFriendlyAddress,
    setCurrentContent,
    walletAccount,
    t,
    showError,
  ]);

  useEffect(
    () =>
      tonConnectUI.onStatusChange((wallet) => {
        if (
          wallet.connectItems?.tonProof &&
          "proof" in wallet.connectItems.tonProof
        ) {
          setProof(wallet.connectItems.tonProof.proof);
          setWalletAccount(wallet.account);
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleTonConnectClick = async () => {
    try {
      if (!userFriendlyAddress) {
        const { data: payload } = await api.get(
          "/api/generate-ton-proof-payload",
        );

        setPayload(payload);

        tonConnectUI.setConnectRequestParameters({
          state: "ready",
          value: { tonProof: payload.payloadToken },
        });

        await tonConnectUI.openModal();
      } else if (walletButton === t("rulletTopUp")) {
        setCurrentContent("cashInRequest");
      }
    } catch (error) {
      console.error(t("rulletAddressCheckError"), error);
      showError(error.message || error);
      setWalletButton(t("rulletConnect"));
    }
  };

  useEffect(() => {
    setWalletButton(t("rulletConnect"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t("rulletConnect")]);

  useEffect(() => {
    if (userFriendlyAddress && walletButton === t("rulletConnect")) {
      setWalletButton(t("rulletTopUp"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFriendlyAddress, walletButton]);

  let userNameText = "User";

  let initData;
  try {
    initData = retrieveLaunchParams();
  } catch (error) {
    console.error("Error retrieving launch params:", error);
    initData = null;
  }
  const user = initData?.tgWebAppData?.user;

  if (user?.username) userNameText = user?.username;
  if (user?.firstName) userNameText = user?.firstName;

  return (
    <div className={styles.profileMain}>
      <div className={styles.profileMain__bg} />
      <div className={styles.profileMain__radialGradientBg} />

      <div className={styles.profileMain__wrapper}>
        <ImageWebp
          src={profileAvatarImg}
          srcSet={profileAvatarWebpImg}
          alt="avatar"
          className={styles.profileMain__avatarImg}
        />
        <h3 className={styles.profileMain__nameText}>{userNameText}</h3>
        <div className={styles.profileMain__buttons}>
          <SecondaryBtn
            isSecondaryVariant
            size="md"
            className={styles.profileMain__btn}
            onClick={handleTonConnectClick}
          >
            <ImageWebp
              src={profiledepositIconImg}
              srcSet={profiledepositIconWebpImg}
              alt="deposit"
            />
            <span>{walletButton}</span>
          </SecondaryBtn>
          <SecondaryBtn
            isSecondaryVariant
            size="md"
            className={styles.profileMain__btn}
            onClick={() => setProfileSubMenu("cashOut")}
          >
            <ImageWebp
              src={profileWithdrawIconImg}
              srcSet={profileWithdrawIconWebpImg}
              alt="withdraw"
            />
            <span>{t("cashOut")}</span>
          </SecondaryBtn>
          <SecondaryBtn
            onClick={() => setProfileSubMenu("advertising")}
            isSecondaryVariant
            size="md"
            className={styles.profileMain__btn}
          >
            <ImageWebp
              src={profileNotificationsiconImg}
              srcSet={profileNotificationsiconWebpImg}
              alt="notifications"
            />
            <span>{t("advertisementCabinet")}</span>
          </SecondaryBtn>
        </div>
      </div>
    </div>
  );
};

export default ProfileMain;
