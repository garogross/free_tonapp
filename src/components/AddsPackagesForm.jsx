import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { tonImg, tonWebpImg } from "../assets/images";
import styles from "./AddsPackagesForm.module.scss";
import ImageWebp from "./layout/ImageWebp/ImageWebp";
import { useNotification } from "./useNotification";

export default function AddsPackagesForm({
  setCurrentContent,
  setSelectedPackage,
  tonBalance,
  adPackages,
}) {
  const { showError } = useNotification();
  const { t } = useTranslation();

  const handleAdPackageClick = (tonBalance, pkg) => {
    if (tonBalance < pkg.price) {
      showError(t("addsPackagesForm.insufficientFunds"));
      return;
    }
    setCurrentContent("addAddForm");
    setSelectedPackage(pkg);
  };

  return (
    <div className={clsx(styles.addPackagesForm, "container")}>
      <div className={styles.addPackagesForm__title}>
        {t("addsPackagesForm.title")}
      </div>
      <div className={styles.addPackagesForm__description}>
        {t("addsPackagesForm.description")}
      </div>
      <div className={styles.addPackagesForm__container}>
        {adPackages.map((pkg) => (
          <div
            key={pkg.adPackageName}
            className={styles.addPackagesForm__item}
            onClick={() => handleAdPackageClick(tonBalance, pkg)}
          >
            <div className={styles.addPackagesForm__itemLeftSide}>
              <div className={styles.addPackagesForm__itemTitle}>
                {pkg.adPackageName}
              </div>
              <div className={styles.addPackagesForm__itemDescription}>
                {t("addsPackagesForm.days")}: {pkg.adDays}
              </div>
            </div>
            <div className={styles.addPackagesForm__itemValueContainer}>
              <div className={styles.addPackagesForm__itemValueTitle}>
                {t("addsPackagesForm.price")}:
              </div>
              <div className={styles.addPackagesForm__itemPriceContainer}>
                <div className={styles.addPackagesForm__itemPrice}>
                  {pkg.price}
                </div>
                <div className={styles.addPackagesForm__itemPriceIcon}>
                  <ImageWebp src={tonImg} srcSet={tonWebpImg} alt="TON" />
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className={styles.addPackagesForm__subdescription}>
          {t("addsPackagesForm.selectPackage")}
        </div>
      </div>
    </div>
  );
}
