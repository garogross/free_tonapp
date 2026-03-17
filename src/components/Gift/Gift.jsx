import clsx from "clsx";
import React from "react";
import styles from "./Gift.module.scss";
import GiftAvailablesList from "./GiftAvailablesList/GiftAvailablesList";
import GiftRullet from "./GiftRullet/GiftRullet";

const Gift = ({
  setCurrentContent,
  gifts,
  getGifts,
  tonBalance,
  setTonBalance,
}) => {
  return (
    <section className={clsx(styles.gift, "container")}>
      <GiftRullet
        gifts={gifts}
        getGifts={getGifts}
        tonBalance={tonBalance}
        setTonBalance={setTonBalance}
      />
      <GiftAvailablesList gifts={gifts} setCurrentContent={setCurrentContent} />
    </section>
  );
};

export default Gift;
