import './AddsPackagesForm.css'
import { useNotification } from './useNotification'
import { useTranslation } from 'react-i18next'

export default function AddsPackagesForm({ setCurrentContent, setSelectedPackage, adPackages, tonBalance }) {
    const { showError } = useNotification();
    const { t } = useTranslation();

    const handleAdPackageClick = (tonBalance, pkg) => {
        if (tonBalance < pkg.price) {
            showError(t('addsPackagesForm.insufficientFunds'));
            return;
        }
        setCurrentContent('addAddForm');
        setSelectedPackage(pkg);
    }

    return (
        <div className="add-packages-form">
            <div className="add-packages-form-title">{t('addsPackagesForm.title')}</div>
            <div className="add-packages-form-description">{t('addsPackagesForm.description')}</div>
            <div className="add-packages-form-container">
                {adPackages.map((pkg) => (
                    <div
                        key={pkg.adPackageName}
                        className="add-packages-form-item"
                        onClick={() => handleAdPackageClick(tonBalance, pkg)}
                    >
                        <div className="add-packages-item-left-side">
                            <div className="add-packages-form-item-title">{pkg.adPackageName}</div>
                            <div className="add-packages-form-item-description">
                                {t('addsPackagesForm.days')}: {pkg.adDays}
                            </div>
                        </div>
                        <div className="add-packages-form-item-value-container">
                            <div className="add-packages-form-item-value-title">{t('addsPackagesForm.price')}:</div>
                            <div className="add-packages-form-item-price-container">
                                <div className="add-packages-form-item-price">{pkg.price}</div>
                                <div className="add-packages-form-item-price-icon">
                                    <img src="/assets/ton.svg" alt="TON" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="add-packages-form-subdescription">{t('addsPackagesForm.selectPackage')}</div>
            </div>
        </div>
    );
}
