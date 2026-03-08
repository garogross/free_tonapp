import { clsx } from "clsx";
import React from "react";
import styles from "./Cran.module.scss";
import RollButton from "./RollButton";
import RollTable from "./RollTable";
import Rullet from "./Rullet";

const Cran = ({
  setSkipEndTime,
  isSkipAvailable,
  setIsSkipAvailable,
  isPushed,
  setIsPushed,
  setLuckyNumber,
  setIsAnimating,
  setEndTime,
  setRollStarted,
  setTonBalance,
  isAnimating,
  currentContent,
  displayNumber,
  luckyNumber,
  endTime,
  rollStarted,
  initialNumbers,
  course,
}) => {
  return (
    <section className={clsx(styles.cran, "container")}>
      <Rullet
        currentContent={currentContent}
        luckyNumber={isAnimating ? displayNumber : luckyNumber}
        isPushed={isPushed}
        endTime={endTime}
        setIsPushed={setIsPushed}
        rollStarted={rollStarted}
        setRollStarted={setRollStarted}
      />
      <RollTable initialNumbers={initialNumbers} course={course} />
      <RollButton
        setIsSkipAvailable={setIsSkipAvailable}
        setIsPushed={setIsPushed}
        setEndTime={setEndTime}
        setSkipEndTime={setSkipEndTime}
        isAnimating={isAnimating}
        setLuckyNumber={setLuckyNumber}
        setTonBalance={setTonBalance}
        isPushed={isPushed}
        setIsAnimating={setIsAnimating}
        setRollStarted={setRollStarted}
        isSkipAvailable={isSkipAvailable}
      />
    </section>
  );
};

export default Cran;
