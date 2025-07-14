import './AddAddForm.css'
import tonIcon from '../assets/ton.svg'
import { useState, useEffect, useRef } from 'react';
import { useNotification } from './useNotification'
import { retrieveRawInitData } from '@telegram-apps/sdk'
import axios from 'axios';

export default function AddAddForm({ selectedPackage, setAdvertisements, setTonBalance, setCurrentContent, setProfileSubMenu, blockedSlots }) {
    const [selectedType, setSelectedType] = useState("1");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { showError, showNotification } = useNotification();
    const [adText, setAdText] = useState('');
    const [adLink, setAdLink] = useState('');
    const [adButtonText, setAdButtonText] = useState('');
    const dropdownRef = useRef(null);
    const [bannerFile, setBannerFile] = useState(null);
    const [bannerPreviewUrl, setBannerPreviewUrl] = useState(null);
    const [bannerLink, setBannerLink] = useState('');

    useEffect(() => {
        if (!bannerFile) {
            setBannerPreviewUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(bannerFile);
        setBannerPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [bannerFile]);


    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        const allowedTypes = ['image/png', 'image/jpeg'];
        if (!file) return;

        if (!allowedTypes.includes(file.type)) {
            showError("Можно загружать только PNG или JPEG изображения");
            return;
        }

        const maxSizeMB = 5;
        if (file.size > maxSizeMB * 1024 * 1024) {
            showError(`Максимальный размер файла ${maxSizeMB} МБ`);
            return;
        }

        const img = new Image();
        img.onload = () => {
            const width = img.width;
            const height = img.height;

            const desiredRatio = 480 / 75;
            const actualRatio = width / height;
            const tolerance = 0.5;

            if (Math.abs(actualRatio - desiredRatio) > tolerance) {
                showError(`Неверное соотношение сторон. Требуется примерно ${desiredRatio.toFixed(2)} (например, 480x75)`);
                return;
            }
            setBannerFile(file);
        };
        img.onerror = () => {
            showError("Не удалось загрузить изображение для проверки");
        };

        img.src = URL.createObjectURL(file);
    };

    const handleAdTextChange = (e) => {
        let value = e.target.value;
        const maxLength = 75;
        if (value.length > maxLength) {
            value = value.slice(0, maxLength);
            showError("Максимальная длина текста 75 символов");
        }

        setAdText(value);
    }

    const handleBannerLinkChange = (e) => {
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

        setBannerLink(value);
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
        { value: "1", label: "Текст" }
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

    const startAdvertisement = (adPackageName, adText, adLink, adButtonText, blockedSlots) => {
        if (blockedSlots === 10) {
            showError("Нет свободных слотов");
            return;
        }
        const formData = new FormData();

        if (selectedType === "1") {
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
            formData.append("adPackageName", adPackageName);
            formData.append("adText", adText);
            formData.append("adLink", adLink);
            formData.append("adButtonText", adButtonText);
            formData.append("adType", selectedType);
        } else if (selectedType === "2") {
            if (!bannerFile) {
                showError("Выберите баннер для загрузки");
                return;
            }
            if (bannerLink.length === 0) {
                showError("Ссылка на продукт обязательна");
                return;
            }
            try {
                new URL(bannerLink);
            } catch (_) {
                if (bannerLink.length > 0) {
                    showError("Введите корректный URL");
                    return;
                }
            }
            formData.append("adPackageName", adPackageName);
            formData.append("banner", bannerFile);
            formData.append("bannerLink", bannerLink);
            formData.append("adType", selectedType);
        }

        const dataRaw = retrieveRawInitData();
        axios.post('/api/advertisement ', formData, {
            headers: {
                'Authorization': 'tma ' + dataRaw,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                setAdvertisements(response.data.advertisements);
                setTonBalance(response.data.tonBalance);
                setCurrentContent('profile');
                setProfileSubMenu('advertising');
                showNotification("Заявка отправлена на модерацию")
            })
            .catch(error => {
                showError("Не удалось выполнить")
                console.error('Post ad error: ', error);
            })
    }

    return (
        <div className="add-add-form">
            <div className="add-add-form-title">Размещение рекламы</div>
            <div className="add-add-form-description">Оформите заявку на размещение рекламы в нашем приложении</div>
            <div className="add-add-form-free-slots">Свободных слотов: {10 - blockedSlots}/10</div>
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
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleBannerChange}
                            className="add-add-form-add-input"
                        />
                        {bannerFile && (
                            <div className="banner-preview-container">
                                <img
                                    src={bannerPreviewUrl}
                                    alt="Превью баннера"
                                    className='banner-preview'
                                />
                            </div>
                        )}
                        <div className="add-banner-description">Размер баннера: 480x75, PNG/JPEG, длительность: 7 сек.</div>
                        <input
                            type="text"
                            placeholder="Введите ссылку"
                            className="add-add-form-add-input"
                            onChange={handleBannerLinkChange}
                            value={bannerLink} />
                    </>
                )}
            </div>
            <button className="add-add-form-add-button" onClick={() => startAdvertisement(selectedPackage.adPackageName, adText, adLink, adButtonText)}>Запустить рекламу</button>
        </div>
    )
}