import './AdvertisingCabinet.css';
import tonIcon from '../assets/ton.svg';
import { openLink } from '@telegram-apps/sdk';

export default function AdvertisingCabinet({ setCurrentContent, tonBalance, advertisements }) {

    const renderAdvertisementsTable = () => {
        if (!advertisements || advertisements.length === 0) {
            return (
                <div className="empty-wrapper">
                    <div className="empty-message">Список пуст</div>
                </div>
            );
        }

        const handleDemoAdClick = (adLink) => {
            if (openLink.isAvailable()) {
                openLink(adLink);
            }
        }

        return advertisements.map((ad, index) => (
            <div className='advertising-container' onClick={() => handleDemoAdClick(ad.adLink)} key={ad.id || index}>
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