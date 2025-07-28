import './AdminSettingsChallenges.css'
import { useState, useEffect } from 'react';
import { useNotification } from "./useNotification";
import { retrieveRawInitData } from '@telegram-apps/sdk';
import axios from "axios";

const FIELD_NAMES = [
    { label: "Цена за 10 сек", field: "price10Sec" },
    { label: "Цена за 20 сек", field: "price20Sec" },
    { label: "Цена за 30 сек", field: "price30Sec" },
    { label: "Цена за 40 сек", field: "price40Sec" },
    { label: "Цена за 50 сек", field: "price50Sec" },
    { label: "Цена за 60 сек", field: "price60Sec" },
];

const TELEGRAM_FIELD_NAMES = [
    { label: "Цена за подписку", field: "followPrice" },
    { label: "Цена за просмотр", field: "viewPrice" }
]

export default function AdminSettingsChallenges({ surfingConfigs, setSurfingConfigs, telegramChallengesConfig, setTelegramChalengesConfig }) {
    const { showError, showNotification } = useNotification();
    const [isLoading, setIsLoading] = useState(false);

    const [inputs, setInputs] = useState({});
    const [telegramInputs, setTelegramInputs] = useState({});
    const [originalInputs, setOriginalInputs] = useState({});
    const [telegramOriginalInputs, setTelegramOriginalInputs] = useState({});

    useEffect(() => {
        if (
            surfingConfigs &&
            surfingConfigs.length > 0 &&
            FIELD_NAMES.every(f => surfingConfigs[0][f.field] !== undefined)
        ) {
            const valObj = {};
            FIELD_NAMES.forEach(f => { valObj[f.field] = String(surfingConfigs[0][f.field]); });
            setInputs(valObj);
            setOriginalInputs(valObj);
        }
    }, [surfingConfigs]);

    useEffect(() => {
        if (
            telegramChallengesConfig &&
            telegramChallengesConfig.length > 0 &&
            TELEGRAM_FIELD_NAMES.every(f => telegramChallengesConfig[0][f.field] !== undefined)
        ) {
            const valObj = {};
            TELEGRAM_FIELD_NAMES.forEach(f => { valObj[f.field] = String(telegramChallengesConfig[0][f.field]); });
            setTelegramInputs(valObj);
            setTelegramOriginalInputs(valObj);
        }
    }, [surfingConfigs]);

    function handleInputChange(field, value) {
        if (/^[0-9]*\.?[0-9]*$/.test(value)) {
            setInputs((state) => ({ ...state, [field]: value }));
        }
    }

    function handleTelegramInputChange(field, value) {
        if (/^[0-9]*\.?[0-9]*$/.test(value)) {
            setTelegramInputs((state) => ({ ...state, [field]: value }));
        }
    }

    const isFormValid =
        Object.keys(inputs).length === FIELD_NAMES.length &&
        FIELD_NAMES.some(f => inputs[f.field] !== originalInputs[f.field]) &&
        Object.values(inputs).every(val => val !== '0' && val !== '');

    const isTelegramFormValid =
        Object.keys(telegramInputs).length === TELEGRAM_FIELD_NAMES.length &&
        TELEGRAM_FIELD_NAMES.some(f => telegramInputs[f.field] !== telegramOriginalInputs[f.field]) &&
        Object.values(telegramInputs).every(val => val !== '0' && val !== '');

    function handleUpdateTelegramConfig() {
        setIsLoading(true);
        const configToSend = {};
        for (const { field } of TELEGRAM_FIELD_NAMES) {
            const num = Number(telegramInputs[field]);
            if (isNaN(num) || num <= 0) {
                showError("Все цены должны быть положительными числами");
                setIsLoading(false);
                return;
            }
            configToSend[field] = num;
        }

        const dataRaw = retrieveRawInitData();
        const postData = {
            ...configToSend,
            id: telegramChallengesConfig && telegramChallengesConfig.length > 0 ? telegramChallengesConfig[0].id : null,
        };

        axios.post('/api/freetonadmin/telegramconfigs', postData, {
            headers: { 'Authorization': 'tma ' + dataRaw }
        })
            .then(response => {
                setTelegramChalengesConfig(response.data);
                showNotification("Изменения сохранены");
                setIsLoading(false);
            })
            .catch(error => {
                showError("Не удалось выполнить");
                console.log('Update surfing config error: {}', error);
                setIsLoading(false);
            });
    }

    function handleUpdateConfig() {
        setIsLoading(true);
        const configToSend = {};
        for (const { field } of FIELD_NAMES) {
            const num = Number(inputs[field]);
            if (isNaN(num) || num <= 0) {
                showError("Все цены должны быть положительными числами");
                setIsLoading(false);
                return;
            }
            configToSend[field] = num;
        }

        const dataRaw = retrieveRawInitData();
        const postData = {
            ...configToSend,
            id: surfingConfigs && surfingConfigs.length > 0 ? surfingConfigs[0].id : null,
        };

        axios.post('/api/freetonadmin/surfingconfigs', postData, {
            headers: { 'Authorization': 'tma ' + dataRaw }
        })
            .then(response => {
                setSurfingConfigs(response.data);
                showNotification("Изменения сохранены");
                setIsLoading(false);
            })
            .catch(error => {
                showError("Не удалось выполнить");
                console.log('Update surfing config error: {}', error);
                setIsLoading(false);
            });
    }

    return (
        <div className="cran-settings-container">
            <div className='create-ad-package-container'>
                <div className='cran-settings-form-title'>
                    РЕДАКТИРОВАНИЕ ЦЕНЫ ЗА SURFING
                </div>
                <div className='create-ad-package-inputs-container'>
                    {FIELD_NAMES.map(({ label, field }) => (
                        <>
                            <div className="challenge-settings-label">{label}</div>
                            <input
                                key={field}
                                type="text"
                                placeholder={label}
                                className="add-add-form-add-input"
                                value={inputs[field] || ''}
                                onChange={e => handleInputChange(field, e.target.value)}
                            />
                        </>
                    ))}
                </div>
                <button
                    className='withdrawal-button create-ad-package'
                    disabled={!isFormValid || isLoading}
                    onClick={handleUpdateConfig}
                >
                    {isLoading ? "СОХРАНЕНИЕ..." : "СОХРАНИТЬ"}
                </button>
            </div>
            <div className='create-ad-package-container'>
                <div className='cran-settings-form-title'>
                    РЕДАКТИРОВАНИЕ ЦЕНЫ ЗА TELEGRAM
                </div>
                <div className='create-ad-package-inputs-container'>
                    {TELEGRAM_FIELD_NAMES.map(({ label, field }) => (
                        <>
                            <div className="challenge-settings-label">{label}</div>
                            <input
                                key={field}
                                type="text"
                                placeholder={label}
                                className="add-add-form-add-input"
                                value={telegramInputs[field] || ''}
                                onChange={e => handleTelegramInputChange(field, e.target.value)}
                            />
                        </>
                    ))}
                </div>
                <button
                    className='withdrawal-button create-ad-package'
                    disabled={!isTelegramFormValid || isLoading}
                    onClick={handleUpdateTelegramConfig}
                >
                    {isLoading ? "СОХРАНЕНИЕ..." : "СОХРАНИТЬ"}
                </button>
            </div>
        </div>
    );
}
