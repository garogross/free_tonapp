import './AdminAdPackages.css';
import tonIcon from '../assets/ton.svg';
import axios from 'axios';
import { retrieveRawInitData } from '@telegram-apps/sdk';
import { useNotification } from './useNotification';
import { useState } from 'react';

export default function AdminAdPackages({ adPackages, setAdPackages }) {
    const { showError, showNotification } = useNotification();
    const [adPackageName, setAdPackageName] = useState('');
    const [adDays, setAdDays] = useState('');
    const [price, setPrice] = useState('');

    const hanleAdPackageNameChange = (e) => {
        setAdPackageName(e.target.value);
    }

    const handleAdDaysChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value >= 1) {
            setAdDays(value);
        }
    }

    const handlePriceChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setPrice(value);
        }
    }

    const handleAddAdPackage = () => {
        if (!adPackageName.trim()) {
            showError('Название тарифа не может быть пустым');
            return;
        }
        const daysNum = Number(adDays);
        if (!daysNum || daysNum < 1 || !Number.isInteger(daysNum)) {
            showError('Количество дней должно быть целым числом не меньшим еденицы');
            return;
        }
        const priceNum = Number(price);
        if (!priceNum || priceNum <= 0) {
            showError('Цена должна быть положительным числом');
            return;
        }

        const dataRaw = retrieveRawInitData();
        const postData = {
            adPackageName: adPackageName.trim(),
            adDays: daysNum,
            price: priceNum
        };
        axios.post('/api/freetonadmin/adPackage', postData, {
            headers: {
                'Authorization': 'tma ' + dataRaw
            }
        })
            .then(response => {
                setAdPackages(response.data.adPackages);
                showNotification("Успешно добавлен тариф");
                setAdPackageName('');
                setAdDays('');
                setPrice('');
            })
            .catch(error => {
                showError("Не удалось выполнить");
                console.error('Post create adPackage error: ', error);
            })
    }

    const handleDelete = (id) => {
        const dataRaw = retrieveRawInitData();
        const postData = {
            id: id
        };
        axios.post('/api/freetonadmin/delete/adPackage', postData, {
            headers: {
                'Authorization': 'tma ' + dataRaw
            }
        })
            .then(response => {
                setAdPackages(response.data.adPackages);
                showNotification("Успешно удалён тариф")
            })
            .catch(error => {
                showError("Не удалось выполнить")
                console.error('Post delete adPackage error: ', error);
            })
    }

    const isFormValid = adPackageName.trim() !== '' &&
        adDays !== '' && Number(adDays) > 0 && Number.isInteger(Number(adDays)) &&
        price !== '' && Number(price) > 0;

    return (
        <>
            <div className="add-packages-form-container">
                {adPackages.map((pkg) => (
                    <div className='add-package-container' key={pkg.id}>
                        <div className="add-packages-form-item">
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
                        <button className='withdrawal-button delete' onClick={() => handleDelete(pkg.id)}>УДАЛИТЬ</button>
                    </div>
                ))}
                <div className='create-ad-package-container'>
                    <div className='create-ad-package-inputs-container'>
                        <input
                            type="text"
                            placeholder="Введите название тарифа..."
                            className="add-add-form-add-input"
                            onChange={hanleAdPackageNameChange}
                            value={adPackageName} />
                        <input
                            type="text"
                            placeholder="Введите количество дней..."
                            className="add-add-form-add-input"
                            onChange={handleAdDaysChange}
                            value={adDays} />
                        <input
                            type="text"
                            placeholder="Введите цену тарифа..."
                            className="add-add-form-add-input"
                            onChange={handlePriceChange}
                            value={price} />
                    </div>
                    <button
                        className='withdrawal-button create-ad-package'
                        onClick={handleAddAdPackage}
                        disabled={!isFormValid}
                    >
                        ДОБАВИТЬ ТАРИФ
                    </button>
                </div>
            </div>
        </>
    );
}
