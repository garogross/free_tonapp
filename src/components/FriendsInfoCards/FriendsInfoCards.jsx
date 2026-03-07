import { useTranslation } from "react-i18next";
import {
  friends2UsersIconImg,
  friends2UsersIconWebpImg,
  friends3UsersIconImg,
  friends3UsersIconWebpImg,
  friendsManyUsersIconImg,
  friendsManyUsersIconWebpImg,
} from "../../../assets/images";
import ImageWebp from "../../layout/ImageWebp/ImageWebp";
import styles from "./FriendsInfoCards.module.scss";

const FriendsInfoCards = () => {
  const { t } = useTranslation();

  const cards = [
    {
      imgSrc: friends2UsersIconImg,
      imgSrcSet: friends2UsersIconWebpImg,
      title: t("friends.rewards.level1Title"),
      reward: t("friends.rewards.level1Desc"),
    },
    {
      imgSrc: friends3UsersIconImg,
      imgSrcSet: friends3UsersIconWebpImg,
      title: t("friends.rewards.level2Title"),
      reward: t("friends.rewards.level2Desc"),
    },
    {
      imgSrc: friendsManyUsersIconImg,
      imgSrcSet: friendsManyUsersIconWebpImg,
      title: t("friends.rewards.level3Title"),
      reward: t("friends.rewards.level3Desc"),
    },
  ];
  return (
    <div className={styles.friendsInfoCards}>
      {cards.map((card) => (
        <div key={card.title} className={styles.friendsInfoCards__card}>
          <ImageWebp
            src={card.imgSrc}
            srcSet={card.imgSrcSet}
            alt={card.title}
            pictureClass={styles.friendsInfoCards__picture}
          />
          <h5 className={styles.friendsInfoCards__cardTitleText}>
            {card.title}
          </h5>
          <p className={styles.friendsInfoCards__rewardText}>{card.reward}</p>
        </div>
      ))}
    </div>
  );
};

export default FriendsInfoCards;
