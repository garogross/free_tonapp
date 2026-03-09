import {
  profileCalmTaskImg,
  profileCalmTaskWebpImg,
  profileInviteTaskImg,
  profileInviteTaskWebpImg,
  profileMineTaskImg,
  profileMineTaskWebpImg,
} from "@/assets/images";
import { useTranslation } from "react-i18next";
import {
  miningInfoIconImg,
  miningInfoIconWebpImg,
} from "../../../assets/images";
import ImageWebp from "../../layout/ImageWebp/ImageWebp";
import MainButton from "../../layout/MainButton/MainButton";
import { useNotification } from "../../useNotification";
import styles from "./ProfileTasks.module.scss";

const tasks = [
  {
    imgSrc: profileInviteTaskImg,
    imgSrcSet: profileInviteTaskWebpImg,
    name: "Пригласить друзей",
    progress: [2, 5],
    reward: 10,
    info: "referralCountingInfo",
  },
  {
    imgSrc: profileCalmTaskImg,
    imgSrcSet: profileCalmTaskWebpImg,
    name: "Собрать с крана",
    progress: [10, 10],
    reward: 5,
  },
  {
    imgSrc: profileMineTaskImg,
    imgSrcSet: profileMineTaskWebpImg,
    name: "Намайнить звезд",
    progress: [0, 35],
    reward: 5,
  },
];

const ProfileTasks = () => {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  return (
    <div className={styles.profileTasks}>
      {tasks.map((task) => (
        <div className={styles.profileTasks__item} key={task.name}>
          <div className={styles.profileTasks__itemMain}>
            <div className={styles.profileTasks__mainTopBlock}>
              <ImageWebp
                src={task.imgSrc}
                srcSet={task.imgSrcSet}
                alt={task.name}
                className={styles.profileTasks__taskImg}
              />
              <h6 className={styles.profileTasks__itemNameText}>
                {task.name}
                {task.info && (
                  <button
                    className={styles.profileTasks__infoBtn}
                    onClick={() => showNotification(t(task.info))}
                  >
                    <ImageWebp
                      src={miningInfoIconImg}
                      srcSet={miningInfoIconWebpImg}
                      alt="info"
                      className={styles.profileTasks__infoImg}
                    />
                  </button>
                )}
              </h6>
            </div>
            <div className={styles.profileTasks__progressBar}>
              <div
                className={styles.profileTasks__progressBarInner}
                style={{
                  width: `${(task.progress[0] / task.progress[1]) * 100}%`,
                }}
              ></div>
              <span className={styles.profileTasks__progressBarText}>
                {task.progress.join("/")}
              </span>
            </div>
          </div>
          <div className={styles.profileTasks__rightBlock}>
            <div className={styles.profileTasks__reward}>
              <span className={styles.profileTasks__rewardNameText}>
                Reward
              </span>
              <div className={styles.profileTasks__rewardValueText}>
                {task.reward} Stars
              </div>
            </div>
            <MainButton size="md">CLAIM</MainButton>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileTasks;
