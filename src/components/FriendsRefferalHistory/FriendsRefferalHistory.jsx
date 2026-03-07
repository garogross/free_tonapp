import { useTranslation } from "react-i18next";
import { starImg, starWebpImg } from "../../../assets/images";
import ImageWebp from "../../layout/ImageWebp/ImageWebp";

import styles from "./FriendsRefferalHistory.module.scss";

const FriendsRefferalHistory = (totalPrize, course, friends) => {
  const { t } = useTranslation();
  const getFriendFullName = (firstName, lastName, index) => {
    if (firstName === "" && lastName === "")
      return t("friends.friendNumber", { number: index + 1 });
    if (!firstName) {
      firstName = "";
    }
    if (!lastName) {
      lastName = "";
    }
    return firstName + " " + lastName;
  };
  return (
    <div className={styles.friendsRefferalHistory}>
      <div className={styles.friendsRefferalHistory__header}>
        <h3 className={styles.friendsRefferalHistory__titleText}>
          {t("friends.yourReferrals")}
        </h3>
        <div className={styles.friendsRefferalHistory__info}>
          <span className={styles.friendsRefferalHistory__infoText}>
            {t("friends.totalReferrals")}:{" "}
            <span className="primaryText">{friends.length}</span>
          </span>
          <span className={styles.friendsRefferalHistory__infoText}>
            {t("friends.totalIncome")}: {(totalPrize * course).toFixed(6)}
            <ImageWebp srcSet={starWebpImg} src={starImg} alt={"star"} />
          </span>
        </div>
      </div>
      {!friends.length ? (
        <div className={styles.friendsRefferalHistory__emptyText}>
          {t("emptyList")}
        </div>
      ) : (
        <div className={styles.friendsRefferalHistory__list}>
          {friends.map((friend, index) => (
            <div
              key={friend.id || index}
              className={styles.friendsRefferalHistory__listItem}
            >
              <span className={styles.friendsRefferalHistory__listItemText}>
                {getFriendFullName(friend.firstName, friend.lastName, index)}
              </span>
              <span className={styles.friendsRefferalHistory__listItemText}>
                <span className="primaryText">
                  - {(friend.prize * course).toFixed(6)} Stars
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsRefferalHistory;
