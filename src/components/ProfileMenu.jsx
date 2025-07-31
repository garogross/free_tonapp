import './ProfileMenu.css'
import { useTranslation } from 'react-i18next';

export default function ProfileMenu({ profileSubMenu, setProfileSubMenu }) {
    const { t } = useTranslation();
    return (
        <div className="profile-menu">
            <button className={`profile-button ${profileSubMenu === 'profile' ? 'active' : ''}`} onClick={() => setProfileSubMenu('profile')}>{t('profileTitle')}</button>
            <button className={`advertising-button ${profileSubMenu === 'advertising' ? 'active' : ''}`} onClick={() => setProfileSubMenu('advertising')}>{t('advertisementCabinet')}</button>
        </div>
    )
};