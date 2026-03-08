import clsx from "clsx";
import styles from "./FootMenu.module.scss";
import {
  FriendsIcon,
  HomeIcon,
  MiningIcon,
  ProfileIcon,
  TasksIcon,
} from "./icons/BottomNavbar";

export default function FootMenu({ setCurrentContent, currentContent }) {
  const items = [
    {
      key: "cran",
      text: "Кран",
      icon: HomeIcon,
    },
    {
      key: "staking",
      text: "Майнинг",
      icon: MiningIcon,
    },
    {
      key: "challenges",
      text: "Задания",
      icon: TasksIcon,
    },
    {
      key: "friends",
      text: "Друзья",
      icon: FriendsIcon,
    },
    {
      key: "profile",
      text: "Профиль",
      icon: ProfileIcon,
    },
  ];

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
              <span className={styles.footMenu__linkText}>{item.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
