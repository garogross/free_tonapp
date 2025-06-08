import './AddsPackagesForm.css'
import tonIcon from '../assets/ton.svg'

export default function AddsPackagesForm( { setCurrentContent, setSelectedPackage } ) {

    return (
        <div className="add-packages-form">
            <div className="add-packages-form-title">Добавить рекламу</div>
            <div className="add-packages-form-description">Покупайте рекламу и продвигайте свой продукт</div>
            <div className="add-packages-form-container">
                <div className="add-packages-form-item" onClick={() => {setCurrentContent('addAddForm'); setSelectedPackage({name: 'start', ruName: 'Старт', days: 1, price: 2})}}>
                    <div className="add-packages-item-left-side">
                        <div className="add-packages-form-item-title">Старт</div>
                        <div className="add-packages-form-item-description">Дней: 1</div>
                    </div>
                    <div className="add-packages-form-item-value-container">
                        <div className="add-packages-form-item-value-title">Цена:</div>
                        <div className="add-packages-form-item-price-container">
                            <div className="add-packages-form-item-price">2</div>
                            <div className="add-packages-form-item-price-icon">
                                <img src={tonIcon} alt="TON" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="add-packages-form-item" onClick={() => {setCurrentContent('addAddForm'); setSelectedPackage({name: 'base', ruName: 'Базовый', days: 2, price: 3})}}>
                    <div className="add-packages-item-left-side">
                        <div className="add-packages-form-item-title">Базовый</div>
                        <div className="add-packages-form-item-description">Дней: 2</div>
                    </div>
                    <div className="add-packages-form-item-value-container">
                        <div className="add-packages-form-item-value-title">Цена:</div>
                        <div className="add-packages-form-item-price-container">
                            <div className="add-packages-form-item-price">3</div>
                            <div className="add-packages-form-item-price-icon">
                                <img src={tonIcon} alt="TON" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="add-packages-form-item" onClick={() => {setCurrentContent('addAddForm'); setSelectedPackage({name: 'business', ruName: 'Бизнес', days: 5, price: 9})}}>
                    <div className="add-packages-item-left-side">
                        <div className="add-packages-form-item-title">Бизнес</div>
                        <div className="add-packages-form-item-description">Дней: 5</div>
                    </div>
                    <div className="add-packages-form-item-value-container">
                        <div className="add-packages-form-item-value-title">Цена:</div>
                        <div className="add-packages-form-item-price-container">
                            <div className="add-packages-form-item-price">9</div>
                            <div className="add-packages-form-item-price-icon">
                                <img src={tonIcon} alt="TON" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="add-packages-form-item" onClick={() => {setCurrentContent('addAddForm'); setSelectedPackage({name: 'pro', ruName: 'Профи', days: 10, price: 17})}}>
                    <div className="add-packages-item-left-side">
                        <div className="add-packages-form-item-title">Профи</div>
                        <div className="add-packages-form-item-description">Дней: 10</div>
                    </div>
                    <div className="add-packages-form-item-value-container" >
                        <div className="add-packages-form-item-value-title">Цена:</div>
                        <div className="add-packages-form-item-price-container">
                            <div className="add-packages-form-item-price">17</div>
                            <div className="add-packages-form-item-price-icon">
                                <img src={tonIcon} alt="TON" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="add-packages-form-subdescription">Выберите необходимый пакет</div>
            </div>
        </div>
    );
}