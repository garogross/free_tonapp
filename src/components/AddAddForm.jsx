import './AddAddForm.css'
import tonIcon from '../assets/ton.svg'
import { useState, useEffect, useRef } from 'react';

export default function AddAddForm( { selectedPackage } ) {
    const [selectedType, setSelectedType] = useState("1");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const options = [
        { value: "1", label: "Текст" },
        { value: "2", label: "Баннер" }
    ];

    const selectedOption = options.find(opt => opt.value === selectedType);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="add-add-form">
            <div className="add-add-form-title">Размещение рекламы</div>
            <div className="add-add-form-description">Оформите заявку на размещение рекламы в нашем приложении</div>
            <div className="add-add-form-free-slots">Свободных слотов: 10/10</div>
            <div className="add-add-form-package-info-title">Информация о пакете</div>
            <div className="add-add-form-package-info-container">
                    <div className="add-add-form-package-info-item-title">Название: {selectedPackage.ruName}</div>
                    <div className="add-add-form-package-info-item-description">Дней: {selectedPackage.days}</div>
                    <div className="add-add-form-package-info-item-price-container">
                        <div className="add-add-form-package-info-item-price">Цена: {selectedPackage.price}</div>
                        <div className="add-add-form-package-info-item-price-icon">
                            <img src={tonIcon} alt="TON" />
                        </div>
                    </div>
            </div>
            <div className="add-add-form-add-title">Добавить рекламу</div>
            <div className="add-add-form-add-container">
                <div className={`add-add-form-add-select-container ${isDropdownOpen ? 'open' : ''}`} ref={dropdownRef}>
                    <div className="add-add-form-add-select" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <span>{selectedOption?.label}</span>
                    </div>
                    {isDropdownOpen && (
                        <div className="add-add-form-add-options">
                            {options.map((option) => (
                                <div key={option.value} className="add-add-form-add-select-option" onClick={() => {setSelectedType(option.value); setIsDropdownOpen(false);}}>
                                    {option.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {selectedType === "1" ? (
                    <>
                        <input type="text" placeholder="Введите текст рекламы" className="add-add-form-add-input" />
                        <input type="text" placeholder="Введите ссылку" className="add-add-form-add-input" />
                        <input type="text" placeholder="Введите текст кнопки" className="add-add-form-add-input" />
                    </>
                ) : (
                    <>
                        <div className="add-banner-title">Выбрать баннер</div>
                        <div className="add-banner-description">Размер баннера: 946х305, длительность: 7 сек.</div>
                        <input type="text" className="add-add-form-add-input" placeholder="Введите ссылку"/>
                    </>
                )}
            </div>
            <button className="add-add-form-add-button">Запустить рекламу</button>
        </div>
    )
}