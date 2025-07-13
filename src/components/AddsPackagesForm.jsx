import './AddsPackagesForm.css'
import tonIcon from '../assets/ton.svg'

export default function AddsPackagesForm({ setCurrentContent, setSelectedPackage, adPackages }) {
  return (
    <div className="add-packages-form">
      <div className="add-packages-form-title">Добавить рекламу</div>
      <div className="add-packages-form-description">Покупайте рекламу и продвигайте свой продукт</div>
      <div className="add-packages-form-container">
        {adPackages.map((pkg) => (
          <div
            key={pkg.adPackageName}
            className="add-packages-form-item"
            onClick={() => {
              setCurrentContent('addAddForm');
              setSelectedPackage(pkg);
            }}
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
        ))}
        <div className="add-packages-form-subdescription">Выберите необходимый пакет</div>
      </div>
    </div>
  );
}
