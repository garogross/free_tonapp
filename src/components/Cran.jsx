import { clsx } from "clsx";
import React, { useState } from "react";
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
  setDepositBalance,
  setEarnedBalance,
  isAnimating,
  currentContent,
  luckyNumber,
  endTime,
  rollStarted,
  initialNumbers,
  course,
}) => {
  const [showTimer, setShowTimer] = useState(true);

  return (
    <section className={clsx(styles.cran, "container")}>
      <Rullet
        currentContent={currentContent}
        luckyNumber={luckyNumber}
        isPushed={isPushed}
        endTime={endTime}
        setIsPushed={setIsPushed}
        rollStarted={rollStarted}
        setRollStarted={setRollStarted}
        showTimer={showTimer}
        isAnimating={isAnimating}
        setShowTimer={setShowTimer}
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
        setDepositBalance={setDepositBalance}
        setEarnedBalance={setEarnedBalance}
        isPushed={isPushed}
        setIsAnimating={setIsAnimating}
        setRollStarted={setRollStarted}
        isSkipAvailable={isSkipAvailable}
        showTimer={showTimer}
      />
    </section>
  );
};

export default Cran;
