import './AddAddForm.css'
import { useState, useEffect, useRef } from 'react';
import { useNotification } from './useNotification'
import { retrieveRawInitData } from '@telegram-apps/sdk'
import axios from 'axios';
import { useTranslation } from 'react-i18next';

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
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();


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
            showError(t('addAddForm.onlyPngJpeg'));
            return;
        }

        const maxSizeMB = 5;
        if (file.size > maxSizeMB * 1024 * 1024) {
            showError(t('addAddForm.maxFileSize', { size: maxSizeMB }));
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
                showError(t('addAddForm.invalidAspectRatio', { ratio: desiredRatio.toFixed(2) }));
                return;
            }
            setBannerFile(file);
        };
        img.onerror = () => {
            showError(t('addAddForm.cantLoadImage'));
        };

        img.src = URL.createObjectURL(file);
    };


    const handleAdTextChange = (e) => {
        let value = e.target.value;
        const maxLength = 75;
        if (value.length > maxLength) {
            value = value.slice(0, maxLength);
            showError(t('addAddForm.maxAdTextLength'));
        }
        setAdText(value);
    }


    const handleBannerLinkChange = (e) => {
        let value = e.target.value;
        const maxLength = 100;
        if (value.length > maxLength) {
            value = value.slice(0, maxLength);
            showError(t('addAddForm.maxLinkLength'));
        }
        try {
            if(value.length > 0) new URL(value);
        } catch (_) {
            if (value.length > 0) {
                showError(t('addAddForm.enterValidUrl'));
            }
        }
        setBannerLink(value);
    }


    const handleAdLinkChange = (e) => {
        let value = e.target.value;
        const maxLength = 100;
        if (value.length > maxLength) {
            value = value.slice(0, maxLength);
            showError(t('addAddForm.maxLinkLength'));
        }
        try {
            if(value.length > 0) new URL(value);
        } catch (_) {
            if (value.length > 0) {
                showError(t('addAddForm.enterValidUrl'));
            }
        }
        setAdLink(value);
    }


    const handleAdButtonTextChange = (e) => {
        let value = e.target.value;
        const maxLength = 15;
        if (value.length > maxLength) {
            value = value.slice(0, maxLength);
            showError(t('addAddForm.maxButtonTextLength'));
        }
        setAdButtonText(value);
    }


    const options = [
        { value: "1", label: t('addAddForm.text') }
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
            showError(t('addAddForm.noFreeSlots'));
            return;
        }
        const formData = new FormData();

        if (selectedType === "1") {
            if (adText.length === 0) {
                showError(t('addAddForm.adTextRequired'));
                return;
            }
            if (adLink.length === 0) {
                showError(t('addAddForm.productLinkRequired'));
                return;
            }
            if (adButtonText.length === 0) {
                showError(t('addAddForm.buttonTextRequired'));
                return;
            }
            try {
                new URL(adLink);
            } catch (_) {
                if (adLink.length > 0) {
                    showError(t('addAddForm.enterValidUrl'));
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
                showError(t('addAddForm.selectBanner'));
                return;
            }
            if (bannerLink.length === 0) {
                showError(t('addAddForm.productLinkRequired'));
                return;
            }
            try {
                new URL(bannerLink);
            } catch (_) {
                if (bannerLink.length > 0) {
                    showError(t('addAddForm.enterValidUrl'));
                    return;
                }
            }
            formData.append("adPackageName", adPackageName);
            formData.append("banner", bannerFile);
            formData.append("bannerLink", bannerLink);
            formData.append("adType", selectedType);
        }
        setIsLoading(true);
        const dataRaw = retrieveRawInitData();
        axios.post('/api/advertisement', formData, {
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
                setIsLoading(false)
                showNotification(t('addAddForm.requestSentForModeration'))
            })
            .catch(error => {
                showError(t('addAddForm.failedToExecute'))
                setIsLoading(false)
                console.error('Post ad error: ', error);
            })
    }


    return (
        <div className="add-add-form">
            <div className="add-add-form-title">{t('addAddForm.adPlacement')}</div>
            <div className="add-add-form-description">{t('addAddForm.adApplyDescription')}</div>
            <div className="add-add-form-free-slots">{t('addAddForm.freeSlots', { freeSlots: 10 - blockedSlots })}</div>
            <div className="add-add-form-package-info-title">{t('addAddForm.packageInfo')}</div>
            <div className="add-add-form-package-info-container">
                <div className="add-add-form-package-info-item-title">{t('addAddForm.name')}: {selectedPackage.adPackageName}</div>
                <div className="add-add-form-package-info-item-description">{t('addAddForm.days')}: {selectedPackage.adDays}</div>
                <div className="add-add-form-package-info-item-price-container">
                    <div className="add-add-form-package-info-item-price">{t('addAddForm.price')}: {selectedPackage.price}</div>
                    <div className="add-add-form-package-info-item-price-icon">
                        <img src="/assets/ton.svg" alt="TON" />
                    </div>
                </div>
            </div>
            <div className="add-add-form-add-title">{t('addAddForm.addAd')}</div>
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
                            placeholder={t('addAddForm.adTextPlaceholder')}
                            className="add-add-form-add-input"
                            onChange={handleAdTextChange}
                            value={adText} />
                        <input
                            type="text"
                            placeholder={t('addAddForm.adLinkPlaceholder')}
                            className="add-add-form-add-input"
                            onChange={handleAdLinkChange}
                            value={adLink} />
                        <input type="text"
                            placeholder={t('addAddForm.adButtonTextPlaceholder')}
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
                                    alt={t('addAddForm.bannerPreviewAlt')}
                                    className='banner-preview'
                                />
                            </div>
                        )}
                        <div className="add-banner-description">{t('addAddForm.bannerSizeDescription')}</div>
                        <input
                            type="text"
                            placeholder={t('addAddForm.bannerLinkPlaceholder')}
                            className="add-add-form-add-input"
                            onChange={handleBannerLinkChange}
                            value={bannerLink} />
                    </>
                )}
            </div>
            <div className='add-add-form-add-button-container'>
                <button className="add-add-form-add-button" onClick={() => startAdvertisement(selectedPackage.adPackageName, adText, adLink, adButtonText, blockedSlots)} disabled={isLoading}>{t('addAddForm.launchAd')}</button>
            </div>
        </div>
    )
}
