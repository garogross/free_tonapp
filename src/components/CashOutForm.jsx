import clsx from "clsx";
import styles from "./CashOutForm.module.scss";
import WithDrawForm from "./Withdraw/WithDrawForm/WithDrawForm";
import WithdrawHistory from "./Withdraw/WithdrawHistory/WithdrawHistory";

export default function CashOutForm({
  earnedBalance,
  setTonBalance,
  setDepositBalance,
  setEarnedBalance,
  setTransactions,
  course,
  transactions,
  goBack,
}) {
  return (
    <section className={clsx(styles.cashOutForm, "container")}>
      <WithDrawForm
        course={course}
        setTransactions={setTransactions}
        setTonBalance={setTonBalance}
        setDepositBalance={setDepositBalance}
        setEarnedBalance={setEarnedBalance}
        earnedBalance={earnedBalance}
        goBack={goBack}
      />
      <WithdrawHistory transactions={transactions} />
    </section>
  );
}
