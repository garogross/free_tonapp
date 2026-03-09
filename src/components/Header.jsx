import { retrieveLaunchParams } from "@telegram-apps/sdk";
import { clsx } from "clsx";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import {
  headerGlobImg,
  headerGlobWebpImg,
  headerStarMinerImg,
  headerStarMinerWebpImg,
} from "../assets/images";
import { languages } from "../data";
import styles from "./Header.module.scss";
import ArrowBottomIcon from "./icons/Common/ArrowBottomIcon";
import ImageWebp from "./layout/ImageWebp/ImageWebp";

const dropdownVariants = {
  open: {
    opacity: 1,
    pointerEvents: "auto",
  },
  closed: {
    opacity: 0,
    pointerEvents: "none",
    transition: { duration: 0.15 },
  },
};

const Header = ({ tonBalance }) => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(
    i18n.language.toLowerCase() === "ru" ? "RU" : "EN",
  );
  const dropdownRef = useRef(null);
  console.log("i18n.language", i18n.language);

  useEffect(() => {
    setSelectedLang(i18n.language.toUpperCase());
  }, [i18n.language]);

  useEffect(() => {
    let data;
    try {
      data = retrieveLaunchParams();
    } catch (error) {
      console.error("Error retrieving launch params:", error);
      data = null;
    }
    if (data?.tgWebAppData?.user?.language_code === "ru") {
      setSelectedLang(languages[0].text);
      i18n.changeLanguage(languages[0].text);
    } else {
      setSelectedLang(languages[0].text);
      i18n.changeLanguage(languages[1].text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleLangSelect = () => setLangOpen((prev) => !prev);

  const handleLangSwitch = (lang) => {
    setSelectedLang(lang);
    try {
      i18n.changeLanguage(lang);
    } catch (error) {
      console.error("i18n error", error);
    }
    setLangOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        {location.pathname !== "/freetonadmin" ? (
          <div className={styles.header__balanceBlock}>
            <ImageWebp
              src={headerStarMinerImg}
              srcSet={headerStarMinerWebpImg}
              alt="star miner"
              className={styles.header__minerStartImg}
            />
            <div className={styles.header__blanceTextsBlock}>
              <span className={styles.header__balanceNameText}>
                {t("balanceTitle")}
              </span>
              <span className={styles.header__balnaceValueText}>
                {typeof tonBalance === "number" && !isNaN(tonBalance)
                  ? tonBalance.toFixed(6)
                  : "0.000000"}
              </span>
            </div>
          </div>
        ) : (
          <div />
        )}
        <div className={styles.header__langSelect} ref={dropdownRef}>
          <button
            className={styles.header__langSelectBtn}
            type="button"
            aria-haspopup="true"
            aria-expanded={langOpen}
            onClick={toggleLangSelect}
            tabIndex={0}
          >
            <ImageWebp
              src={headerGlobImg}
              srcSet={headerGlobWebpImg}
              alt="globus"
              className={styles.header__globImg}
            />
            <span className={styles.header__langText}>{selectedLang}</span>
            <ArrowBottomIcon
              className={clsx(
                styles.header__langarrowIcon,
                langOpen && styles.header__langarrowIcon_active,
              )}
            />
          </button>
          <AnimatePresence>
            {langOpen && (
              <Motion.div
                className={styles.header__dropdownContent}
                initial="closed"
                animate="open"
                exit="closed"
                variants={dropdownVariants}
                style={{ zIndex: 10 }}
              >
                <button
                  className={clsx(
                    styles.header__dropdownItem,
                    selectedLang === "RU" && styles.header__dropdownItem_active,
                  )}
                  onClick={() => handleLangSwitch("RU")}
                  type="button"
                >
                  RU
                </button>
                <button
                  className={clsx(
                    styles.header__dropdownItem,
                    selectedLang === "EN" && styles.header__dropdownItem_active,
                  )}
                  onClick={() => handleLangSwitch("EN")}
                  type="button"
                >
                  EN
                </button>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
