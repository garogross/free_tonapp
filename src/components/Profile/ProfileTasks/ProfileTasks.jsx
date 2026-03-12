import {
  profileCalmTaskImg,
  profileCalmTaskWebpImg,
  profileInviteTaskImg,
  profileInviteTaskWebpImg,
  profileMineTaskImg,
  profileMineTaskWebpImg,
} from "@/assets/images";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../../api/axios";
import {
  miningInfoIconImg,
  miningInfoIconWebpImg,
} from "../../../assets/images";
import ImageWebp from "../../layout/ImageWebp/ImageWebp";
import MainButton from "../../layout/MainButton/MainButton";
import { useNotification } from "../../useNotification";
import styles from "./ProfileTasks.module.scss";

const taskInfos = {
  invite_friends: "referralCountingInfo",
};
const maxLevels = {
  invite_friends: 100,
};

const questImages = {
  faucet_collect: {
    src: profileCalmTaskImg,
    srcSet: profileCalmTaskWebpImg,
  },
  invite_friends: {
    src: profileInviteTaskImg,
    srcSet: profileInviteTaskWebpImg,
  },
  mining_earned: {
    src: profileMineTaskImg,
    srcSet: profileMineTaskWebpImg,
  },
};

const questOrder = ["invite_friends", "faucet_collect", "mining_earned"];

const ProfileTasks = ({ quests, setQuests, setTonBalance }) => {
  const { t } = useTranslation();
  const { showNotification, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [claimingTask, setClaimingTask] = useState(null);

  useEffect(() => {
    async function getQuests() {
      api
        .get("/api/quests")
        .then((response) => {
          setQuests(response.data.quests);
        })
        .catch((error) => {
          console.error("Getting accelerate balance error: ", error);
        });
    }
    getQuests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const claim = (questType) => {
    setLoading(true);
    setClaimingTask(questType);
    api
      .post("/api/quests/claim", { questType })
      .then((response) => {
        if (response.data?.quests) setQuests(response.data?.quests);
        if (response.data.tonBalance) setTonBalance(response.data.tonBalance);
        // response.data.quests
        // response.data.tonBalance
        // response.data.faucetCollects
        // response.data.qualifiedFriends
        // response.data.miningEarned
      })
      .catch(() => {
        showError(t("failedToClaimReward"));
      })
      .finally(() => {
        setLoading(false);
        setClaimingTask(null);
      });
  };

  return (
    <div className={styles.profileTasks}>
      {!quests.length ? (
        <div className={styles.profileTasks__messageText}>
          {t("profileTasks.emptyList")}
        </div>
      ) : (
        [...quests]
          .sort(
            (a, b) =>
              questOrder.indexOf(a.questType) - questOrder.indexOf(b.questType),
          )
          .map((quest) => {
            let btnContent = t("profileTasks.claim");
            if (loading && claimingTask === quest?.questType)
              btnContent = (
                <span className={styles.profileTasks__loader}></span>
              );
            const completed =
              maxLevels[quest.questType] &&
              maxLevels[quest.questType] === quest.level;
            if (completed) btnContent = t("profileTasks.completed");

            return (
              <div className={styles.profileTasks__item} key={quest.questType}>
                <div className={styles.profileTasks__itemMain}>
                  <div className={styles.profileTasks__mainTopBlock}>
                    <ImageWebp
                      src={questImages[quest.questType].src}
                      srcSet={questImages[quest.questType].srcSet}
                      alt={t(quest.questType)}
                      className={styles.profileTasks__taskImg}
                    />
                    <h6 className={styles.profileTasks__itemNameText}>
                      {t(quest.questType)}
                      {taskInfos[quest.questType] && (
                        <button
                          className={styles.profileTasks__infoBtn}
                          onClick={() =>
                            showNotification(t(taskInfos[quest.questType]))
                          }
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
                        width: `${Math.min(
                          100,
                          (quest.currentValue / quest.targetValue) * 100,
                        )}%`,
                      }}
                    ></div>
                    <span className={styles.profileTasks__progressBarText}>
                      {quest.currentValue}/{quest.targetValue}
                    </span>
                  </div>
                </div>
                <div className={styles.profileTasks__rightBlock}>
                  <div className={styles.profileTasks__reward}>
                    <span className={styles.profileTasks__rewardNameText}>
                      {t("profileTasks.reward")}
                    </span>
                    <div className={styles.profileTasks__rewardValueText}>
                      {quest.reward} Stars
                    </div>
                  </div>
                  <MainButton
                    onClick={() => claim(quest.questType)}
                    disabled={
                      quest.currentValue < quest.targetValue ||
                      loading ||
                      completed
                    }
                    size="md"
                  >
                    {btnContent}
                  </MainButton>
                </div>
              </div>
            );
          })
      )}
    </div>
  );
};

export default ProfileTasks;
