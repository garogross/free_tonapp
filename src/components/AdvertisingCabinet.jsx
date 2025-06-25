import './AdvertisingCabinet.css';
import tonIcon from '../assets/ton.svg';
export default function AdvertisingCabinet( {setCurrentContent, tonBalance} ) {
    return (
        <div className="advertising-cabinet">
            <div className="advertising-cabinet-title">Рекламный кабинет</div>
            <div className="advertising-cabinet-description">Пополняйте и выводите свои средства в Ton</div>
            <div className="advertising-cabinet-balance-title">Ваш баланс</div>
            <div className="advertising-cabinet-balance-container">
                <div className="advertising-cabinet-balance-value">{tonBalance.toFixed(6)}</div>
                <div className="balance-icon">
                    <img src={tonIcon} alt="TON" />
                </div>
            </div>
            <div className="adds-list-title">Список рекламы</div>
            <div className="adds-list">Список пуст</div>
            <button className="buy-add-button" onClick={() => setCurrentContent('addPackagesForm')}>Купить рекламу</button>
        </div>
    );
};