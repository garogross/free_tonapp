import './CashInForm.css';
export default function CashInForm({ setCurrentContent }) {
    return (
        <div className="cash-in-form">
            <div className="cash-in-form-title">Пополнить</div>
            <div className="cash-in-form-description">Вы можете пополнить свой счёт в Ton</div>
            <div className="qr-code-title">Отсканируйте QR-код</div>
            <div className="address-title">или скопируйте адрес</div>
            <div className="address"></div>
            <button className="address-copy" onClick={() => navigator.clipboard.writeText('k')}>СКОПИРОВАТЬ</button>
            <button className="address-pay" onClick={() => setCurrentContent('cran')}>Я ОПЛАТИЛ</button>
        </div>
    );
}