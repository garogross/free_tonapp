import './AdvertisingCabinet.css';
import tonIcon from '../assets/ton.svg';
import { openLink } from '@telegram-apps/sdk';

export default function AdvertisingCabinet({ setCurrentContent, tonBalance, advertisements, adPackages }) {

    const handleDemoAdClick = (adLink) => {
        if (openLink.isAvailable()) {
            openLink(adLink);
        }
    }

    const calculateDeadline = (adPackageName, moderatedAt, adPackages) => {
        const pkg = adPackages.find(p => p.adPackageName === adPackageName);
        if (!pkg || !moderatedAt) return null;
        const startDate = new Date(moderatedAt);
        startDate.setDate(startDate.getDate() + pkg.adDays);
        return startDate.toLocaleString('ru-RU', { hour12: false });
    }

    const getStatusMeaning = (status) => {
        if (status === "moderation") {
            return "на модерации";
        }
        if (status === "active") {
            return "активен";
        }
        if (status === "deprecated") {
            return "показ закончен";
        }
        if (status === "deny") {
            return "отклонён";
        }
    }

    const renderAdvertisementsTable = () => {
        if (!advertisements || advertisements.length === 0) {
            return (
                <div className="empty-wrapper">
                    <div className="empty-message">Список пуст</div>
                </div>
            );
        }

        return advertisements.map((ad, index) => (
            <div className='demo-ad-container' key={ad.id || index}>
                <div className='demo-ad-info-container'>
                    <div className='demo-add-info'>
                        Пакет: {ad.adPackageName}
                    </div>
                    <div className='demo-add-info'>
                        Дата создания: {new Date(ad.createdAt).toLocaleString('ru-RU', { hour12: false })}
                    </div>
                    <div className='demo-add-info'>
                        Статус: {getStatusMeaning(ad.status)}
                    </div>
                    {ad.status === 'active' && (
                        <div className='demo-add-info'>
                            Показ закончится: {calculateDeadline(ad.adPackageName, ad.moderatedAt, adPackages)}
                        </div>
                    )}
                </div>
                <div className='advertising-container' onClick={() => handleDemoAdClick(ad.adLink)}>
                    <div className="add-container">
                        <div className='add-text'>
                            {ad.adText}
                        </div>
                        <div className="add-actions">
                            <button className="add-ad">Реклама</button>
                            <button className="add-button">{ad.adButtonText}</button>
                        </div>
                    </div>
                </div>
            </div>
        ));
    }

    return (
        <div className="advertising-cabinet">
            <div className="advertising-cabinet-title">Рекламный кабинет</div>
            <div className="advertising-cabinet-balance-title">Ваш баланс</div>
            <div className="advertising-cabinet-balance-container">
                <div className="advertising-cabinet-balance-value">{tonBalance.toFixed(6)}</div>
                <div className="balance-icon">
                    <img src={tonIcon} alt="TON" />
                </div>
            </div>
            <div className="adds-list-title">Список рекламы</div>
            <div className="adds-list">
                {renderAdvertisementsTable()}
            </div>
            <button className="buy-add-button" onClick={() => setCurrentContent('addPackagesForm')}>Купить рекламу</button>
        </div>
    );
};