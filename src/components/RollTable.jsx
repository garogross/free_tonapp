import { starImg, starWebpImg } from "@/assets/images";
import { useTranslation } from "react-i18next";
import styles from "./RollTable.module.scss";
import ImageWebp from "./layout/ImageWebp/ImageWebp";

const ranges = [
  "0 - 9885",
  "9886 - 9985",
  "9886 - 9993",
  "9894 - 9997",
  "9998 - 9999",
];

const RollTable = ({ initialNumbers, course }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.rollTable}>
      <div className={styles.rollTable__col}>
        <span className={styles.rollTable__headerRow}>
          {t("rulletTableNumberTitle")}
        </span>
        <span className={styles.rollTable__headerRow}>
          {t("rulletTablePrizeTitle")}
        </span>
      </div>
      <div className={styles.rollTable__body}>
        {ranges.map((item, index) => (
          <div key={item} className={styles.rollTable__col}>
            <span className={styles.rollTable__bodyRow}>{item}</span>
            <span className={styles.rollTable__bodyRow}>
              {initialNumbers && initialNumbers[index] !== undefined
                ? (initialNumbers[index] * course).toFixed(6)
                : "-"}
              <ImageWebp srcSet={starWebpImg} src={starImg} alt={"star"} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RollTable;
