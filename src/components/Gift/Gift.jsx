import clsx from "clsx";
import React from "react";
import styles from "./Gift.module.scss";
import GiftAvailablesList from "./GiftAvailablesList/GiftAvailablesList";
import GiftRullet from "./GiftRullet/GiftRullet";

const Gift = ({ setCurrentContent }) => {
  return (
    <section className={clsx(styles.gift, "container")}>
      <GiftRullet />
      <GiftAvailablesList setCurrentContent={setCurrentContent} />
    </section>
  );
};

export default Gift;
