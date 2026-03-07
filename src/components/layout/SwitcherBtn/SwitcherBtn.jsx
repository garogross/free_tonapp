import clsx from "clsx";
import { useTranslation } from "react-i18next";
import styles from "./SwitcherBtn.module.scss";

const SwitcherBtn = ({ active, onClick }) => {
  const { t } = useTranslation();
  return (
    <button onClick={onClick} className={styles.switcherBtn}>
      <span className={styles.switcherBtn__nameText}>{t("clientTitle")}</span>
      <div className={styles.switcherBtn__main}>
        <span
          className={clsx(
            styles.switcherBtn__inner,
            !active && styles.switcherBtn__inner_active,
          )}
        ></span>
      </div>
    </button>
  );
};

export default SwitcherBtn;
