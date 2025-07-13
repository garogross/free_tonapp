import './AddAddForm.css'
import tonIcon from '../assets/ton.svg'
import { useState, useEffect, useRef } from 'react';
import { useNotification } from './useNotification'
import { retrieveRawInitData } from '@telegram-apps/sdk'
import axios from 'axios';

export default function AddAddForm({ selectedPackage, setAdvertisements, setTonBalance, setCurrentContent, setProfileSubMenu }) {
    const [selectedType, setSelectedType] = useState("1");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { showError, showNotification } = useNotification();
    const [adText, setAdText] = useState('');
    const [adLink, setAdLink] = useState('');
    const [adButtonText, setAdButtonText] = useState('');
    const dropdownRef = useRef(null);

    const handleAdTextChange = (e) => {
        let value = e.target.value;
        const maxLength = 100;
        if (value.length > maxLength) {
            value = value.slice(0, maxLength);
            showError("Максимальная длина текста 100 символов");
        }

        setAdText(value);
    }

    const handleAdLinkChange = (e) => {
        let value = e.target.value;
        const maxLength = 100;
        if (value.length > maxLength) {
            value = value.slice(0, maxLength);
            showError("Максимальная длина ссылки 100 символов");
        }
        try {
            new URL(value);
        } catch (_) {
            if (value.length > 0) {
                showError("Введите корректный URL");
            }
        }

        setAdLink(value);
    }

    const handleAdButtonTextChange = (e) => {
        let value = e.target.value;
        const maxLength = 15;
        if (value.length > maxLength) {
            value = value.slice(0, maxLength);
            showError("Максимальная длина текста кнопки 15 символов");
        }

        setAdButtonText(value);
    }

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

    const startAdvertisement = (adPackageName, adText, adLink, adButtonText) => {
        if (adText.length === 0) {
            showError("Текст рекламы обязателен");
            return;
        }

        if (adLink.length === 0) {
            showError("Ссылка на продукт обязательна");
            return;
        }

        if (adButtonText.length === 0) {
            showError("Текст кнопки обязателен");
            return;
        }

        try {
            new URL(adLink);
        } catch (_) {
            if (adLink.length > 0) {
                showError("Введите корректный URL");
                return;
            }
        }

        const dataRaw = retrieveRawInitData();
        const postData = {
            adPackageName: adPackageName,
            adText: adText,
            adLink: adLink,
            adButtonText: adButtonText
        };
        axios.post('/api/advertisement ', postData, {
            headers: {
                'Authorization': 'tma ' + dataRaw
            }
        })
            .then(response => {
                setAdvertisements(response.data.advertisements);
                setTonBalance(response.data.tonBalance);
                setCurrentContent('profile');
                setProfileSubMenu('advertising');
                showNotification("Успешно выполнено")
            })
            .catch(error => {
                showError("Не удалось выполнить")
                console.error('Post decision error: ', error);
            })
    }

    return (
        <div className="add-add-form">
            <div className="add-add-form-title">Размещение рекламы</div>
            <div className="add-add-form-description">Оформите заявку на размещение рекламы в нашем приложении</div>
            <div className="add-add-form-free-slots">Свободных слотов: 10/10</div>
            <div className="add-add-form-package-info-title">Информация о пакете</div>
            <div className="add-add-form-package-info-container">
                <div className="add-add-form-package-info-item-title">Название: {selectedPackage.adPackageName}</div>
                <div className="add-add-form-package-info-item-description">Дней: {selectedPackage.adDays}</div>
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
                                <div key={option.value} className="add-add-form-add-select-option" onClick={() => { setSelectedType(option.value); setIsDropdownOpen(false); }}>
                                    {option.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {selectedType === "1" ? (
                    <>
                        <input
                            type="text"
                            placeholder="Введите текст рекламы"
                            className="add-add-form-add-input"
                            onChange={handleAdTextChange}
                            value={adText} />
                        <input
                            type="text"
                            placeholder="Введите ссылку"
                            className="add-add-form-add-input"
                            onChange={handleAdLinkChange}
                            value={adLink} />
                        <input type="text"
                            placeholder="Введите текст кнопки"
                            className="add-add-form-add-input"
                            onChange={handleAdButtonTextChange}
                            value={adButtonText} />
                    </>
                ) : (
                    <>
                        <div className="add-banner-title">Выбрать баннер</div>
                        <div className="add-banner-description">Размер баннера: 946х305, длительность: 7 сек.</div>
                        <input type="text" className="add-add-form-add-input" placeholder="Введите ссылку" />
                    </>
                )}
            </div>
            <button className="add-add-form-add-button" onClick={() => startAdvertisement(selectedPackage.adPackageName, adText, adLink, adButtonText)}>Запустить рекламу</button>
        </div>
    )
}