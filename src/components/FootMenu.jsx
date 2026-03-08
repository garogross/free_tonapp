import clsx from "clsx";
import { useTranslation } from "react-i18next";
import styles from "./FootMenu.module.scss";
import {
  FriendsIcon,
  HomeIcon,
  MiningIcon,
  ProfileIcon,
  TasksIcon,
} from "./icons/BottomNavbar";
const items = [
  {
    key: "cran",
    text: "cran",
    icon: HomeIcon,
  },
  {
    key: "staking",
    text: "staking",
    icon: MiningIcon,
  },
  {
    key: "challenges",
    text: "challenges",
    icon: TasksIcon,
  },
  {
    key: "friends",
    text: "friends",
    icon: FriendsIcon,
  },
  {
    key: "profile",
    text: "profile",
    icon: ProfileIcon,
  },
];

export default function FootMenu({ setCurrentContent, currentContent }) {
  const { t } = useTranslation();

  return (
    <div className={styles.footMenu}>
      <div className={styles.footMenu__container}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.text}
              to={item.link}
              onClick={() => setCurrentContent(item.key)}
              className={clsx(styles.footMenu__link, {
                [styles.footMenu__link_active]: item.key === currentContent,
              })}
            >
              <Icon className={styles.footMenu__icon} />
              <span className={styles.footMenu__linkText}>
                {t("footMenu." + item.text)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
