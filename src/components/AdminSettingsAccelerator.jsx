import "./AdminSettingsAccelerator.css"
import { useState, useEffect } from 'react';
import { useNotification } from "./useNotification";
import { retrieveRawInitData } from '@telegram-apps/sdk';
import axios from "axios";

export default function AdminSettingsAccelerator({ acceleratorsConfig, setAcceleratorsConfig }) {
    const { showError, showNotification } = useNotification();
    const [inputs, setInputs] = useState([]);
    const [originalConfig, setOriginalConfig] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const acceleratorNames = {
        1: 'CORE I-9',
        2: 'RTX 4090',
        3: 'A100 GPU'
    };

    useEffect(() => {
        if (Array.isArray(acceleratorsConfig) && acceleratorsConfig.length > 0) {
            const prepared = acceleratorsConfig.map(acc => ({
                id: acc.id,
                rentPeriod: String(acc.rentPeriod),
                profitPerDay: String(acc.profitPerDay),
                rentPrice: String(acc.rentPrice),
            }));
            setInputs(prepared);
            setOriginalConfig(prepared);
        }
    }, [acceleratorsConfig]);

    function handleInputChange(index, field, value) {
        if (/^\d*\.?\d*$/.test(value)) {
            const newInputs = [...inputs];
            newInputs[index] = { ...newInputs[index], [field]: value };
            setInputs(newInputs);
        }
    }

    const isFormValid = inputs.length > 0 &&
        inputs.every(acc =>
            acc.rentPeriod !== '' &&
            acc.profitPerDay !== '' &&
            acc.rentPrice !== '' &&
            !isNaN(Number(acc.rentPeriod)) && Number(acc.rentPeriod) > 0 &&
            !isNaN(Number(acc.profitPerDay)) && Number(acc.profitPerDay) > 0 &&
            !isNaN(Number(acc.rentPrice)) && Number(acc.rentPrice) > 0
        ) &&
        inputs.some((acc, idx) => {
            const orig = originalConfig[idx];
            return !orig ||
                acc.rentPeriod !== orig.rentPeriod ||
                acc.profitPerDay !== orig.profitPerDay ||
                acc.rentPrice !== orig.rentPrice;
        });

    async function handleSave() {
        setIsLoading(true);
        try {
            const payload = inputs.map(acc => ({
                id: acc.id,
                rentPeriod: Number(acc.rentPeriod),
                profitPerDay: Number(acc.profitPerDay),
                rentPrice: Number(acc.rentPrice),
            }));

            const dataRaw = retrieveRawInitData();

            const response = await axios.post('/api/freetonadmin/acceleratorsconfig', payload, {
                headers: { Authorization: 'tma ' + dataRaw }
            });

            if (response.data && Array.isArray(response.data)) {
                setAcceleratorsConfig(response.data.acceleratorsConfig);
                showNotification("Настройки ускорителей сохранены");
            } else {
                setAcceleratorsConfig(payload);
                showNotification("Настройки ускорителей сохранены");
            }

            setIsLoading(false);
        } catch (error) {
            console.error('Ошибка сохранения конфигурации:', error);
            showError("Не удалось сохранить настройки");
            setIsLoading(false);
        }
    }

    return (
        <div className="cran-settings-container">
            <div className='create-ad-package-container'>
                <div className='cran-settings-form-title'>
                    РЕДАКТИРОВАНИЕ УСКОРИТЕЛЕЙ
                </div>
                <div className='create-ad-package-inputs-container'>
                    {inputs.map((acc, index) => (
                        <div key={acc.id} className="accelerator-edit-row" style={{ marginBottom: 12 }}>
                            <div className='admin-settings-accelerators-sub'>
                                <div style={{ marginBottom: 8, fontWeight: 600, color: '#333' }}>
                                    Ускоритель: {acceleratorNames[acc.id] || 'Неизвестный'}
                                </div>
                            </div>
                            <div>ПЕРИОД АРЕНДЫ:</div>
                            <input
                                type="text"
                                placeholder="Период аренды (дней)"
                                className="add-add-form-add-input"
                                value={acc.rentPeriod}
                                onChange={e => handleInputChange(index, 'rentPeriod', e.target.value)}
                            />
                            <div>ПРИБЫЛЬ В ДЕНЬ:</div>
                            <input
                                type="text"
                                placeholder="Прибыль в день (TON)"
                                className="add-add-form-add-input"
                                value={acc.profitPerDay}
                                onChange={e => handleInputChange(index, 'profitPerDay', e.target.value)}
                            />
                            <div>ЦЕНА ЗА УСКОРИТЕЛЬ:</div>
                            <input
                                type="text"
                                placeholder="Цена аренды (TON)"
                                className="add-add-form-add-input"
                                value={acc.rentPrice}
                                onChange={e => handleInputChange(index, 'rentPrice', e.target.value)}
                            />
                        </div>
                    ))}
                </div>
                <button
                    className='withdrawal-button create-ad-package'
                    disabled={!isFormValid || isLoading}
                    onClick={handleSave}
                >
                    {isLoading ? "СОХРАНЕНИЕ..." : "СОХРАНИТЬ"}
                </button>
            </div>
        </div>
    );
}
