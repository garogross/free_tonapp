import "./AdminSettingsCran.css"
import { useState, useEffect } from 'react';

export default function AdminSettingsCran({ initialNumbers }) {
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

    const isFormValid = inputs.some((val, idx) => val !== originalInputs[idx]);

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
                    disabled={!isFormValid}
                    onClick={() => {
                        const numbers = inputs.map(Number);
                        console.log('Сохраняем:', numbers);
                    }}
                >
                    СОХРАНИТЬ
                </button>
            </div>
        </div>
    );
}
