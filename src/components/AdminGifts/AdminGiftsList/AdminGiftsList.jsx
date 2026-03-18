import { api } from "@/api/axios";
import { starImg } from "@/assets/images";
import { clsx } from "clsx";
import React, { useEffect, useState } from "react";
import {
  chanceDiceiconImg,
  chanceDiceiconWebpImg,
  starWebpImg,
} from "../../../assets/images";
import ImageWebp from "../../layout/ImageWebp/ImageWebp";
import MainButton from "../../layout/MainButton/MainButton";
import AdminGiftsEditChancesModal from "../AdminGiftsEditChancesModal/AdminGiftsEditChancesModal";
import styles from "./AdminGiftsList.module.scss";

const AdminGiftsList = () => {
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [editingItemId, setEditingItemId] = useState(false);
  const [tier, setTier] = useState(25);
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);
  const editingItem = gifts.find((item) => editingItemId === item.id);

  const filteredGifts = gifts.filter((gift) => gift.tier === tier);

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
        //     "displayChance": 10.00,
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
  if (!filteredGifts.length)
    return <p className={styles.adminGiftsList__messageText}>Список пуст</p>;

  return (
    <>
      <div className={styles.adminGiftsList__starsBar}>
        <button
          disabled={loading}
          className={clsx(
            styles.adminGiftsList__starsBarBtn,
            tier === 25 && styles.adminGiftsList__starsBarBtn_active,
          )}
          onClick={() => {
            setTier(25);

            getGifts(25);
          }}
        >
          25
          <ImageWebp src={starImg} srcSet={starWebpImg} alt="star" />
        </button>
        <button
          disabled={loading}
          onClick={() => {
            setTier(50);

            getGifts(50);
          }}
          className={clsx(
            styles.adminGiftsList__starsBarBtn,
            tier === 50 && styles.adminGiftsList__starsBarBtn_active,
          )}
        >
          50
          <ImageWebp src={starImg} srcSet={starWebpImg} alt="star" />
        </button>
      </div>
      <section className={styles.adminGiftsList}>
        <div className={styles.adminGiftsList__list}>
          {filteredGifts
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((gift) => (
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
                  <ImageWebp
                    src={chanceDiceiconImg}
                    srcSet={chanceDiceiconWebpImg}
                    alt="dice"
                  />
                  {gift.dropChance || "--"}%
                </p>
                <p className={styles.adminGiftsList__starsText}>
                  <>
                    Демо
                    <ImageWebp
                      src={chanceDiceiconImg}
                      srcSet={chanceDiceiconWebpImg}
                      alt="dice"
                    />
                  </>{" "}
                  {gift.demoDropChance || "--"}%
                </p>
                <p className={styles.adminGiftsList__starsText}>
                  <>
                    Fake
                    <ImageWebp
                      src={chanceDiceiconImg}
                      srcSet={chanceDiceiconWebpImg}
                      alt="dice"
                    />
                  </>{" "}
                  {gift.displayChance || "--"}%
                </p>
                <MainButton
                  onClick={() => {
                    setEditingItemId(gift.id);
                    setEditModalOpened(true);
                  }}
                  className={styles.adminGiftsList__btn}
                  size="sm"
                >
                  <span>Изменить Шансы</span>
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
                          displayChance: chances.displayChanceValue,
                        }
                      : gift,
                  ),
                );
              }
            }}
            giftId={editingItemId}
            giftDropChance={editingItem.dropChance}
            giftDemoDropChance={editingItem.demoDropChance}
            gifDisplayChance={editingItem.displayChance}
          />
        )}
      </section>
    </>
  );
};

export default AdminGiftsList;
