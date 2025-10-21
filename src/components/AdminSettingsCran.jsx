import "./AdminSettingsCran.css"
import { useState, useEffect } from 'react';
import { useNotification } from "./useNotification";
import { retrieveRawInitData } from '@telegram-apps/sdk';
import axios from "axios";

export default function AdminSettingsCran({ initialNumbers, setInitialNumbers, course, setCourse }) {
    const { showError, showNotification } = useNotification();
    const [isLoading, setIsLoading] = useState(false);
    const [inputs, setInputs] = useState(Array(6).fill(''));

    const [originalInputs, setOriginalInputs] = useState(Array(6).fill(''));

    useEffect(() => {
        if (initialNumbers && initialNumbers.length === 6) {
            const strings = initialNumbers.map(num => String(num));
            setInputs(strings);
            setOriginalInputs(strings);
        }
    }, [initialNumbers]);

    function handleInputChange(index, value) {
        if (/^\d*\.?\d*$/.test(value)) {
            const newInputs = [...inputs];
            newInputs[index] = value;
            setInputs(newInputs);
        }
    }
    function toNonNegativeInt(value) {
        const n = Number(value.trim());
        if (!Number.isFinite(n)) return null;
        if (!Number.isInteger(n)) return null;
        if (n < 0) return null;
        return n;
    }

    function handleCourseInputChange(value) {
        const n = toNonNegativeInt(value);
        if (n !== null) setCourse(n);
    }


    const isFormValid = inputs.some((val, idx) => val !== originalInputs[idx]) && inputs.every(val => val !== '0' && val !== '');

    const handleUpdateCourse = () => {
        setIsLoading(true);
        const dataRaw = retrieveRawInitData();

        const postData = {
            starsPerTon: course
        };

        axios.post('/api/freetonadmin/course', postData, {
            headers: {
                'Authorization': 'tma ' + dataRaw
            }
        })
            .then(response => {
                setCourse(response.data.starsPerTon);
                showNotification("Изменения сохранены");
                setIsLoading(false);
            })
            .catch(error => {
                showError("Не удалось выполнить");
                console.error('Post update course error: ', error);
                setIsLoading(false);
            })
    }

    const handleUpdatePrizeTable = () => {
        setIsLoading(true);
        const numbers = inputs.map(val => Number(val));
        if (numbers.some(num => isNaN(num) || num <= 0)) {
            showError("Все призы должны быть положительными числами");
            setIsLoading(false);
            return;
        }

        const dataRaw = retrieveRawInitData();
        const postData = {
            prizesTable: numbers
        };
        axios.post('/api/freetonadmin/prizestable', postData, {
            headers: {
                'Authorization': 'tma ' + dataRaw
            }
        })
            .then(response => {
                setInitialNumbers(response.data.prizesTable);
                setOriginalInputs(response.data.prizesTable.map(String));
                showNotification("Изменения сохранены");
                setIsLoading(false);
            })
            .catch(error => {
                showError("Не удалось выполнить");
                console.error('Post update prize table error: ', error);
                setIsLoading(false);
            })
    }

    return (
        <div className="cran-settings-container">
            <div className='create-ad-package-container'>
                <div className='cran-settings-form-title'>
                    РЕДАКТИРОВАНИЕ ПРИЗОВ
                </div>
                <div className='create-ad-package-inputs-container'>
                    {inputs.map((value, index) => (
                        <input
                            key={index}
                            type="text"
                            placeholder={`Приз ${index + 1}`}
                            className="add-add-form-add-input"
                            value={value}
                            onChange={e => handleInputChange(index, e.target.value)}
                        />
                    ))}
                </div>
                <button
                    className='withdrawal-button create-ad-package'
                    disabled={!isFormValid || isLoading}
                    onClick={handleUpdatePrizeTable}
                >
                    {isLoading ? "СОХРАНЕНИЕ..." : "СОХРАНИТЬ"}
                </button>
            </div>
            <div className="create-ad-package-container">
                <div className='cran-settings-form-title'>
                    КОЛИЧЕСТВО STARS ЗА 1 TON
                </div>
                <div className='create-ad-package-inputs-container'>
                    <input
                        type="text"
                        placeholder="Кол-во stars за 1 TON"
                        className="add-add-form-add-input"
                        value={course}
                        onChange={e => handleCourseInputChange(e.target.value)}
                    />
                </div>
                <button
                    className='withdrawal-button create-ad-package'
                    disabled={isLoading}
                    onClick={handleUpdateCourse}
                >
                    {isLoading ? "СОХРАНЕНИЕ..." : "СОХРАНИТЬ"}
                </button>
            </div>
        </div>
    );
}
