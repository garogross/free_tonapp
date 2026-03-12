import {
  friendsCopyIconImg,
  friendsCopyIconWebpImg,
  friendsHeroImg,
  friendsHeroWebpImg,
} from "@/assets/images";
import { useTranslation } from "react-i18next";
import ImageWebp from "../layout/ImageWebp/ImageWebp";

import { retrieveLaunchParams } from "@telegram-apps/sdk";
import clsx from "clsx";
import { useNotification } from "../useNotification";
import styles from "./FriendsHero.module.scss";

const FriendsHero = ({ handleInvite }) => {
  let initData;
  try {
    initData = retrieveLaunchParams();
  } catch (error) {
    console.error("Error retrieving launch params:", error);
    initData = null;
  }
  const userId = initData?.tgWebAppData?.user?.id;
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const writeLinkInClipboard = () => {
    navigator.clipboard.writeText(
      "https://t.me/F_r_e_e_S_t_a_r_s_Bot?start=" + userId,
    );
    showNotification(t("friends.linkCopied"), 1000);
  };

  return (
    <div className={styles.friendsHero}>
      <ImageWebp
        src={friendsHeroImg}
        srcSet={friendsHeroWebpImg}
        alt="referal"
        className={styles.friendsHero__img}
      />
      <button
        onClick={handleInvite}
        className={clsx(styles.friendsHero__shareBtn, "container")}
      >
        <span className={styles.friendsHero__shareBtnText}>
          {t("friends.invite")}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            writeLinkInClipboard();
          }}
          className={styles.friendsHero__shareBtnCopy}
        >
          <div className={styles.friendsHero__shareBtnCopyIconWrapper}>
            <ImageWebp
              src={friendsCopyIconImg}
              srcSet={friendsCopyIconWebpImg}
              alt="copy"
              className={styles.friendsHero__copyImg}
            />
          </div>
        </button>
      </button>
    </div>
  );
};

export default FriendsHero;
