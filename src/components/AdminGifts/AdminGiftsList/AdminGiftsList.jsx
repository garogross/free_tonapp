import { api } from "@/api/axios";
import { starImg } from "@/assets/images";
import React, { useEffect, useState } from "react";
import { starWebpImg } from "../../../assets/images";
import ImageWebp from "../../layout/ImageWebp/ImageWebp";
import MainButton from "../../layout/MainButton/MainButton";
import AdminGiftsEditChancesModal from "../AdminGiftsEditChancesModal/AdminGiftsEditChancesModal";
import styles from "./AdminGiftsList.module.scss";

const AdminGiftsList = () => {
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [editingItemId, setEditingItemId] = useState(false);
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);
  const editingItem = gifts.find((item) => editingItemId === item.id);

  async function getGifts() {
    api
      .get("/api/freetonadmin/gifts")
      .then((response) => {
        setGifts(response.data);
        // {
        //     "id": 1,
        //     "name": "Heart",
        //     "imageUrl": "heart",
        //     "tier": 25,
        //     "dropChance": 25.00,
        //     "demoDropChance": 10.00,
        //     "convertValue": 15,
        //     "displayOrder": 1,
        //     "active": true
        //   },
      })
      .catch((error) => {
        setErrored(true);
        console.error("Get Gifts error: ", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  useEffect(() => {
    getGifts();
  }, []);

  if (loading)
    return <p className={styles.adminGiftsList__messageText}>Loading...</p>;
  if (errored)
    return (
      <p className={styles.adminGiftsList__messageText}>
        Ошибка при получении данние
      </p>
    );
  if (!gifts.length)
    return <p className={styles.adminGiftsList__messageText}>Список пуст</p>;

  return (
    <section className={styles.adminGiftsList}>
      <div className={styles.adminGiftsList__list}>
        {gifts.map((gift) => (
          <div key={gift.id} className={styles.adminGiftsList__item}>
            <ImageWebp
              src={`/images/gifts/${gift.imageUrl}.png`}
              srcSet={`/images/gifts/${gift.imageUrl}.webp`}
              alt="gift"
              className={styles.adminGiftsList__img}
            />
            <p className={styles.adminGiftsList__starsText}>
              {gift.convertValue}
              <ImageWebp src={starImg} srcSet={starWebpImg} alt="star" />
            </p>
            <p className={styles.adminGiftsList__starsText}>
              <strong>Шанс</strong> {gift.dropChance}%
            </p>
            <p className={styles.adminGiftsList__starsText}>
              <strong>Шанс на демо</strong> {gift.demoDropChance}%
            </p>
            <MainButton
              onClick={() => {
                setEditingItemId(gift.id);
                setEditModalOpened(true);
              }}
              className={styles.adminGiftsList__btn}
              size="sm"
            >
              Изменить Шансы
            </MainButton>
          </div>
        ))}
      </div>

      {editingItem && (
        <AdminGiftsEditChancesModal
          show={editModalOpened}
          onClose={(chances) => {
            setEditModalOpened(false);
            if (chances) {
              setGifts((prev) =>
                prev.map((gift) =>
                  gift.id === editingItemId
                    ? {
                        ...gift,
                        dropChance: chances.dropChance,
                        demoDropChance: chances.demoDropChance,
                      }
                    : gift,
                ),
              );
            }
          }}
          giftId={editingItemId}
          giftDropChance={editingItem.dropChance}
          giftDemoDropChance={editingItem.demoDropChance}
        />
      )}
    </section>
  );
};

export default AdminGiftsList;
