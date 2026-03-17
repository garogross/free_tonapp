import { starImg } from "@/assets/images";
import React, { useEffect, useState } from "react";
import { api } from "../../../api/axios";
import { starWebpImg } from "../../../assets/images";
import ImageWebp from "../../layout/ImageWebp/ImageWebp";
import MainButton from "../../layout/MainButton/MainButton";
import { useNotification } from "../../useNotification";
import styles from "./AdminGiftsWithdrawals.module.scss";

const AdminGiftsWithdrawals = () => {
  const { showNotification, showError } = useNotification();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [decisionLoading, setDecisionLoading] = useState(false);
  const [errored, setErrored] = useState(false);

  async function getWithdrawals() {
    api
      .get("/api/freetonadmin/gifts/withdrawals")
      .then((response) => {
        setWithdrawals(response.data);
        // {
        //     "userGiftId": 123,
        //     "telegramId": 912061672,
        //     "telegramUsername": "emir_dev",
        //     "giftName": "Cake",
        //     "giftImageUrl": "cake",
        //     "tier": 25,
        //     "requestedAt": "2026-03-16T14:00:00+00:00"
        //   }
      })
      .catch((error) => {
        setErrored(true);
        console.error("Get Gifts error: ", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function handleWithdrawalDecision(giftId, isRejected) {
    if (!giftId) return;
    setDecisionLoading(true);
    api
      .post("/api/freetonadmin/gifts/withdrawals", {
        userGiftId: giftId,
        decision: isRejected ? "deny" : "done",
      })
      .then(() => {
        showNotification(`Вывод ${isRejected ? "отклонён" : "одобрен"}`);
        setWithdrawals((prev) =>
          prev.filter((item) => item.userGiftId !== giftId),
        );
      })
      .catch((error) => {
        console.error(error);
        showError("Произашла ошбка при запросе");
      })
      .finally(() => setDecisionLoading(false));
  }

  useEffect(() => {
    getWithdrawals();
  }, []);

  if (loading)
    return (
      <p className={styles.adminGiftsWithdrawals__messageText}>Loading...</p>
    );
  if (errored)
    return (
      <p className={styles.adminGiftsWithdrawals__messageText}>
        Ошибка при получении данние
      </p>
    );
  if (!withdrawals.length)
    return (
      <p className={styles.adminGiftsWithdrawals__messageText}>Список пуст</p>
    );

  return (
    <section className={styles.adminGiftsWithdrawals}>
      <div className={styles.adminGiftsWithdrawals__list}>
        {withdrawals.map((withdrawal) => (
          <div
            key={withdrawal.id}
            className={styles.adminGiftsWithdrawals__item}
          >
            <div className={styles.adminGiftsWithdrawals__itemWrapper}>
              <ImageWebp
                src={`/images/gifts/${withdrawal.giftImageUrl}.png`}
                srcSet={`/images/gifts/${withdrawal.giftImageUrl}.webp`}
                alt="gift"
                className={styles.adminGiftsWithdrawals__img}
              />
              <div className={styles.adminGiftsWithdrawals__itemMain}>
                <p className={styles.adminGiftsWithdrawals__text}>
                  <strong>{withdrawal.giftName}</strong>
                  <span className={styles.adminGiftsWithdrawals__starsText}>
                    {withdrawal.tier}
                    <ImageWebp src={starImg} srcSet={starWebpImg} alt="star" />
                  </span>
                </p>
                <p className={styles.adminGiftsWithdrawals__text}>
                  <strong>User:</strong> {withdrawal.telegramUsername}
                </p>
              </div>
            </div>
            <p className={styles.adminGiftsWithdrawals__text}>
              <strong>Дата запроса:</strong>{" "}
              {new Date(withdrawal.requestedAt).toLocaleDateString("ru-RU")}
            </p>
            <MainButton
              disabled={decisionLoading}
              onClick={() => handleWithdrawalDecision(withdrawal.userGiftId)}
              className={styles.adminGiftsWithdrawals__btn}
              size="sm"
            >
              Одобрить
            </MainButton>
            <MainButton
              disabled={decisionLoading}
              onClick={() =>
                handleWithdrawalDecision(withdrawal.userGiftId, true)
              }
              isSecondaryVariant
              isSecondaryVariantonClick={() => {}}
              className={styles.adminGiftsWithdrawals__btn}
              size="sm"
            >
              Отклонить
            </MainButton>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminGiftsWithdrawals;
