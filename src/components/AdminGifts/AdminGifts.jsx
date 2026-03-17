import clsx from "clsx";
import React, { useState } from "react";
import styles from "./AdminGifts.module.scss";
import AdminGiftsList from "./AdminGiftsList/AdminGiftsList";
import AdminGiftsWithdrawals from "./AdminGiftsWithdrawals/AdminGiftsWithdrawals";

const AdminGifts = () => {
  const [activeTab, setActiveTab] = useState("gifts");
  return (
    <section className={clsx(styles.adminGift, "container")}>
      <div className={styles.adminGift__tabBar}>
        <button
          onClick={() => setActiveTab("gifts")}
          className={clsx(
            styles.adminGift__tabBarBtn,
            activeTab === "gifts" && styles.adminGift__tabBarBtn_active,
          )}
        >
          Подарки
        </button>
        <button
          onClick={() => setActiveTab("withdrawals")}
          className={clsx(
            styles.adminGift__tabBarBtn,
            activeTab === "withdrawals" && styles.adminGift__tabBarBtn_active,
          )}
        >
          Выводы
        </button>
      </div>
      {activeTab === "gifts" ? <AdminGiftsList /> : <AdminGiftsWithdrawals />}
    </section>
  );
};

export default AdminGifts;
