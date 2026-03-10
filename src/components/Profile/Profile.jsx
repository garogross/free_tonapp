import ProfileMain from "./ProfileMain/ProfileMain";
import ProfileTasks from "./ProfileTasks/ProfileTasks";

import clsx from "clsx";
import styles from "./Profile.module.scss";

const Profile = ({
  setProfileSubMenu,
  setCurrentContent,
  quests,
  setQuests,
  setTonBalance,
}) => {
  return (
    <section className={clsx(styles.profile, "container")}>
      <ProfileMain
        setProfileSubMenu={setProfileSubMenu}
        setCurrentContent={setCurrentContent}
      />
      <ProfileTasks
        quests={quests}
        setQuests={setQuests}
        setTonBalance={setTonBalance}
      />
    </section>
  );
};

export default Profile;
