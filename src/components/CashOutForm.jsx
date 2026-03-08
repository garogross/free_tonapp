import clsx from "clsx";
import styles from "./CashOutForm.module.scss";
import WithDrawForm from "./Withdraw/WithDrawForm/WithDrawForm";
import WithdrawHistory from "./Withdraw/WithdrawHistory/WithdrawHistory";

export default function CashOutForm({
  tonBalance,
  setTonBalance,
  setTransactions,
  course,
  transactions,
  goBack,
}) {
  return (
    <section className={clsx(styles.cashOutForm, "container")}>
      <WithDrawForm
        tonBalance={tonBalance}
        course={course}
        setTransactions={setTransactions}
        setTonBalance={setTonBalance}
        goBack={goBack}
      />
      <WithdrawHistory transactions={transactions} />
    </section>
  );
}
