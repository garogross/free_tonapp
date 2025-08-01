import './AdvertisingCabinet.css';
import { openLink } from '@telegram-apps/sdk';
import { useTranslation } from 'react-i18next';

export default function AdvertisingCabinet({ setCurrentContent, tonBalance, advertisements, adPackages }) {
    const { t } = useTranslation();

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
            return t('status.moderation').toLowerCase();
        }
        if (status === "active") {
            return t('status.active').toLowerCase();
        }
        if (status === "deprecated") {
            return t('status.deprecated').toLowerCase();
        }
        if (status === "deny") {
            return t('status.deny').toLowerCase();
        }
    }

    const renderAdvertisementsTable = () => {
        if (!advertisements || advertisements.length === 0) {
            return (
                <div className="empty-wrapper">
                    <div className="empty-message">{t('emptyList')}</div>
                </div>
            );
        }

        return advertisements.map((ad, index) => (
            <div className='demo-ad-container' key={ad.id || index}>
                <div className='demo-ad-info-container'>
                    <div className='demo-add-info'>
                        {t('advertisingCabinet.package')}: {ad.adPackageName}
                    </div>
                    <div className='demo-add-info'>
                        {t('advertisingCabinet.creationDate')}: {new Date(ad.createdAt).toLocaleString('ru-RU', { hour12: false })}
                    </div>
                    <div className={`demo-add-info ${ad.status}`}>
                        {t('advertisingCabinet.status')}: {getStatusMeaning(ad.status)}
                    </div>
                    {ad.status === 'active' && (
                        <div className='demo-add-info'>
                            {t('advertisingCabinet.showEnds')}: {calculateDeadline(ad.adPackageName, ad.moderatedAt, adPackages)}
                        </div>
                    )}
                </div>
                <div className='advertising-container' onClick={() => handleDemoAdClick(ad.adLink)}>
                    <div className="add-container">
                        <div className='add-text'>
                            {ad.adText}
                        </div>
                        <div className="add-actions">
                            <button className="add-ad">{t('adButtonText')}</button>
                            <button className="add-button">{ad.adButtonText}</button>
                        </div>
                    </div>
                </div>
            </div>
        ));
    }

    return (
        <div className="advertising-cabinet">
            <div className="advertising-cabinet-balance-title">{t('yourBalanceTitle')}</div>
            <div className="advertising-cabinet-balance-container">
                <div className="advertising-cabinet-balance-value">{tonBalance.toFixed(6)}</div>
                <div className="balance-icon">
                    <img src="/assets/ton.svg" alt="TON" />
                </div>
            </div>
            <div className="adds-list-title">{t('advertisingCabinet.adsList')}</div>
            <div className="adds-list">
                {renderAdvertisementsTable()}
            </div>
            <button className="buy-add-button" onClick={() => setCurrentContent('addPackagesForm')}>
                {t('advertisingCabinet.buyAd')}
            </button>
        </div>
    );
};
