import { useTranslation } from "react-i18next";
import "./MenuItem.css";

export default function MenuItem(props) {
  const { t } = useTranslation();

  return (
    <div
      className={`menu-item ${props.isActive ? "active" : ""} ${props.alt === "Операции" ? "admin-menu-item" : ""}`}
      onClick={props.onClick}
    >
      <img src={props.image} alt={props.alt} className="menu-item-icon" />
      <span className="menu-item-text">{t(props.textKey)}</span>
    </div>
  );
}
