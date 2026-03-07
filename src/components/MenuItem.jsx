import './MenuItem.css';
import { useTranslation } from 'react-i18next';

export default function MenuItem( props ) {
  const { t } = useTranslation();
  const { Icon } = props;
  
  return (
    <div className={`menu-item ${props.isActive ? 'active' : ''} ${props.alt === "Операции" ? 'admin-menu-item' : ''}`} onClick={props.onClick}>
        <Icon className="menu-item-icon" />
        <span className="menu-item-text">{t(props.textKey)}</span>
    </div>
  )
}