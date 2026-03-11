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
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ImageWebp from "../../layout/ImageWebp/ImageWebp";
import SecondaryBtn from "../../layout/SecondaryBtn/SecondaryBtn";
import ProfileDepositModal from "../ProfileDepositModal/ProfileDepositModal";
import styles from "./ProfileMain.module.scss";

const ProfileMain = ({
  setProfileSubMenu,
  setCurrentContent,
  getTonBalance,
}) => {
  const { t } = useTranslation();
  const [depositModalOpened, setDepositModalOpened] = useState(false);

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
        <div className={styles.profileMain__wrapperMain}>
          <h3 className={styles.profileMain__nameText}>{userNameText}</h3>
          <div className={styles.profileMain__buttons}>
            <SecondaryBtn
              isSecondaryVariant
              size="sm"
              className={styles.profileMain__btn}
              onClick={() => setDepositModalOpened(true)}
            >
              <ImageWebp
                src={profiledepositIconImg}
                srcSet={profiledepositIconWebpImg}
                alt="deposit"
              />
              <span>{t("rulletTopUp")}</span>
            </SecondaryBtn>
            <SecondaryBtn
              isSecondaryVariant
              size="sm"
              className={styles.profileMain__btn}
              onClick={() => setCurrentContent("cashOut")}
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
              size="sm"
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
      <ProfileDepositModal
        show={depositModalOpened}
        onClose={() => setDepositModalOpened(false)}
        getTonBalance={getTonBalance}
      />
    </div>
  );
};

export default ProfileMain;
