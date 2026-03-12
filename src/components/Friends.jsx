import {
  retrieveLaunchParams,
  shareMessage,
  ShareMessageError,
} from "@telegram-apps/sdk";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Friends.module.scss";
import FriendsHero from "./FriendsHero/FriendsHero";
import FriendsInfoCards from "./FriendsInfoCards/FriendsInfoCards";
import FriendsRefferalHistory from "./FriendsRefferalHistory/FriendsRefferalHistory";
import { useNotification } from "./useNotification";

export default function Friends({ friends, course }) {
  const { showError } = useNotification();
  const [totalPrize, setTotalPrize] = useState(0);
  let initData;
  try {
    initData = retrieveLaunchParams();
  } catch (error) {
    console.error("Error retrieving launch params:", error);
    initData = null;
  }
  const userId = initData?.tgWebAppData.user.id;
  const { t } = useTranslation();

  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  const messageId = getQueryParam("message_id");

  const handleInvite = async () => {
    if (shareMessage.isAvailable()) {
      try {
        await shareMessage(messageId);
      } catch (error) {
        if (
          error instanceof ShareMessageError &&
          error.message === "USER_DECLINED"
        ) {
          return;
        }
        console.log(error);
        showError(t("friends.openAppViaStart"));
      }
    }
  };

  useEffect(() => {
    const total = friends.reduce((acc, friend) => acc + friend.prize, 0);
    setTotalPrize(total);
  }, [friends]);
  console.log("friends", { friends: friends.length });

  return (
    <>
      <section className={styles.friends}>
        <FriendsHero handleInvite={handleInvite} userId={userId} />
        <div className="container">
          <FriendsInfoCards />
          <FriendsRefferalHistory
            totalPrize={totalPrize}
            course={course}
            friends={friends}
          />
        </div>
      </section>
    </>
  );
}
