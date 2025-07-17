import './AddChallengeForm.css';
import { useEffect, useState } from 'react';
import { useNotification } from './useNotification';
import { retrieveRawInitData } from '@telegram-apps/sdk'
import axios from 'axios';

export default function AddChallengeForm({ currentChallenge, challengesConfigs, tonBalance }) {
    const { showError, showNotification } = useNotification();
    const [selectedTimes, setSelectedTimes] = useState("10");
    const [challengeName, setChallengeName] = useState('');
    const [challengeDescription, setChallengeDescription] = useState('');
    const [challengeLink, setChallengeLink] = useState('');
    const [challengeDoAmount, setChallengeDoAmount] = useState('');
    const [calculateTotalPrice, setCalculateTotalPrice] = useState(0)
    const [isLoading, setIsLoading] = useState(false);
    const [checkLinkResult, setCheckLinkResult] = useState(null);

    const handleTimesClick = (time) => {
        setSelectedTimes(time);
    }

    const handleChallengeNameChange = (e) => {
        let value = e.target.value;
        const maxLength = 20;
        if (value.length > maxLength) {
            value = value.slice(0, maxLength);
            showError("Максимальная длина названия 20 символов");
        }

        setChallengeName(value);
    }

    const handleChallengeDescriptionChange = (e) => {
        let value = e.target.value;
        const maxLength = 40;
        if (value.length > maxLength) {
            value = value.slice(0, maxLength);
            showError("Максимальная длина описания 40 символов");
        }

        setChallengeDescription(value);
    }

    const handleChallengeLinkChange = (e) => {
        let value = e.target.value;
        const maxLength = 100;

        if (value.length > maxLength) {
            value = value.slice(0, maxLength);
            showError("Максимальная длина ссылки 100 символов");
        }
        if (value.length > 0) {
            try {
                const url = new URL(value);
                if (url.protocol !== "https:") {
                    showError("Ссылка должна начинаться с https://");
                    return;
                }
            } catch (_) {
                showError("Введите корректный URL");
            }
        }

        setChallengeLink(value);
    };


    const handleChallengeDoAmountChange = (e) => {
        let value = e.target.value;
        if (value === '' || (/^\d+$/.test(value) && Number(value) > 0)) {
            setChallengeDoAmount(value);
        } else {
            showError("Количество выполнений - целое положительное число");
        }
    }

    const titleCurrentChalengeToName = (currentChallenge) => {
        switch (currentChallenge) {
            case 'surfing': return "серфинг";
            case 'telegram': return "телеграм";
            default: return 'surfing';
        }
    }

    const selectedTimesToDtoArgumen = (activeSurfingConfig) => {
        if (!activeSurfingConfig) return 0;
        switch (selectedTimes) {
            case "10": return activeSurfingConfig.price10Sec;
            case "20": return activeSurfingConfig.price20Sec;
            case "30": return activeSurfingConfig.price30Sec;
            case "40": return activeSurfingConfig.price40Sec;
            case "50": return activeSurfingConfig.price50Sec;
            case "60": return activeSurfingConfig.price60Sec;
        }
    }

    useEffect(() => {
        setIsLoading(true);
        if (!challengesConfigs?.surfingConfigs) return;
        const activeSurfingConfig = challengesConfigs.surfingConfigs.find(cfg => cfg.status === "active");
        if (!activeSurfingConfig) return;
        const priceBySelectedTimes = selectedTimesToDtoArgumen(activeSurfingConfig);
        let doAmount = Number(challengeDoAmount) || 0;
        setCalculateTotalPrice((priceBySelectedTimes || 0) * doAmount);
        setIsLoading(false);
    }, [selectedTimes, challengeDoAmount, challengesConfigs]);

    const handleCheckLink = () => {
        const maxLength = 100;
        if (challengeLink.length > maxLength) {
            showError("Максимальная длина ссылки 100 символов");
            return;
        }
        if (challengeLink.length > 0) {
            try {
                const url = new URL(challengeLink);
                if (url.protocol !== "https:") {
                    showError("Ссылка должна начинаться с https://");
                    return;
                }
            } catch (_) {
                showError("Введите корректный URL");
                return;
            }
        } else {
            showError("Введите ссылку");
            return;
        }

        const dataRaw = retrieveRawInitData();
        setCheckLinkResult(null);
        setIsLoading(true);
        const postData = {
            challengeLink: challengeLink
        }
        axios.post('/api/checklink/iframe', postData, {
            headers: {
                'Authorization': 'tma ' + dataRaw
            }
        })
            .then(response => {
                setCheckLinkResult(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.log("Checklink for iframe error: {}", error);
                setIsLoading(false);
            })
    }

    const renderCheckLinkResult = () => {
        if (checkLinkResult === null) {
            return;
        }
        return checkLinkResult ? (
            <div className='check-link-result yes'>ССЫЛКА ДОСТУПНА ДЛЯ ВСТРАИВАНИЯ</div>
        ) : (
            <div className='check-link-result no'>ЭТУ ССЫЛКУ НЕЛЬЗЯ ДОБАВИТЬ ДЛЯ СЕРФИНГА</div>
        )
    }

    return (
        <div className="add-challenge-form">
            <div className="add-challenge-form-title">Создать задание {titleCurrentChalengeToName(currentChallenge)}</div>
            <div className="add-challenge-form-input-container">
                <input
                    className='add-challenge-form-input'
                    type="text"
                    placeholder="Название..."
                    onChange={handleChallengeNameChange}
                    value={challengeName}
                />
                <textarea
                    className='add-challenge-form-input'
                    type="text"
                    placeholder="Описание..."
                    onChange={handleChallengeDescriptionChange}
                    value={challengeDescription}
                />
                <input
                    className='add-challenge-form-input'
                    type="text"
                    placeholder="Введите ссылку..."
                    onChange={handleChallengeLinkChange}
                    value={challengeLink}
                />
                <div className='link-ping-check'>Проверьте сайт на доступность</div>
                <button className='ping-check-button' onClick={handleCheckLink} disabled={isLoading}>ПРОВЕРИТЬ САЙТ</button>
                {renderCheckLinkResult()}
                <div className='times-container-title'>Время на сайте (в секундах)</div>
                <div className='times-container'>
                    <div className={`times-container-item ${selectedTimes === "10" ? "active" : ""}`} onClick={() => handleTimesClick("10")}>10</div>
                    <div className={`times-container-item ${selectedTimes === "20" ? "active" : ""}`} onClick={() => handleTimesClick("20")}>20</div>
                    <div className={`times-container-item ${selectedTimes === "30" ? "active" : ""}`} onClick={() => handleTimesClick("30")}>30</div>
                    <div className={`times-container-item ${selectedTimes === "40" ? "active" : ""}`} onClick={() => handleTimesClick("40")}>40</div>
                    <div className={`times-container-item ${selectedTimes === "50" ? "active" : ""}`} onClick={() => handleTimesClick("50")}>50</div>
                    <div className={`times-container-item ${selectedTimes === "60" ? "active" : ""}`} onClick={() => handleTimesClick("60")}>60</div>
                </div>
                <input
                    className='add-challenge-form-input'
                    type="text"
                    placeholder="Введите количество выполнений..."
                    onChange={handleChallengeDoAmountChange}
                    value={challengeDoAmount}
                />
            </div>
            <div className='total-price-container'>
                <div className='total-price-container-title'>К оплате:</div>
                <div className={`total-price-container-price ${tonBalance < calculateTotalPrice ? 'red' : 'green'}`}>{calculateTotalPrice.toFixed(6)}</div>
            </div>
            <div className='add-challenge-form-button-container'>
                <button className='add-challenge-form-button' disabled={isLoading || tonBalance < calculateTotalPrice}>ЗАПУСТИТЬ ЗАДАНИЕ</button>
            </div>
        </div>
    )
}