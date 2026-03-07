import clsx from "clsx";
import { Link } from "react-router-dom";
import { addTaskPagePath, tasksPagePath } from "../../../router/constants";
import styles from "./SwitcherBtn.module.scss";

const SwitcherBtn = ({ isCustomer }) => {
  return (
    <Link
      to={isCustomer ? addTaskPagePath : tasksPagePath}
      className={styles.switcherBtn}
    >
      <span className={styles.switcherBtn__nameText}>
        {isCustomer ? "Я заказчик" : "Я исполнитель"}
      </span>
      <div className={styles.switcherBtn__main}>
        <span
          className={clsx(
            styles.switcherBtn__inner,
            !isCustomer && styles.switcherBtn__inner_right,
          )}
        ></span>
      </div>
    </Link>
  );
};

export default SwitcherBtn;
