import './AdminAdPackages.css';
import tonIcon from '../assets/ton.svg';

export default function AdminAdPackages({ adPackages }) {
    return (
        <>
            <div className="add-packages-form-container">
                {adPackages.map((pkg) => (
                    <div className='add-package-container'>
                        <div
                            key={pkg.adPackageName}
                            className="add-packages-form-item"
                        >
                            <div className="add-packages-item-left-side">
                                <div className="add-packages-form-item-title">{pkg.adPackageName}</div>
                                <div className="add-packages-form-item-description">Дней: {pkg.adDays}</div>
                            </div>
                            <div className="add-packages-form-item-value-container">
                                <div className="add-packages-form-item-value-title">Цена:</div>
                                <div className="add-packages-form-item-price-container">
                                    <div className="add-packages-form-item-price">{pkg.price}</div>
                                    <div className="add-packages-form-item-price-icon">
                                        <img src={tonIcon} alt="TON" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className='withdrawal-button delete'>УДАЛИТЬ</button>
                    </div>
                ))}
            </div>
            <div className='create-ad-package-button-container'>
                <button className='withdrawal-button create-ad-package'>ДОБАВИТЬ ТАРИФ</button>
            </div>
        </>
    );
}