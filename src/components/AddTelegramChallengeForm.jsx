import './AddTelegramChallengeForm.css'
import { useState, useRef, useEffect } from 'react';
import { useNotification } from './useNotification';
import { retrieveRawInitData } from '@telegram-apps/sdk'
import axios from 'axios';

export default function AddTelegramChallengeForm({ tonBalance, challengesConfigs, currentChallenge, setTonBalance, setChallenges }) {
    const { showError, showNotification } = useNotification();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedType, setSelectedType] = useState("1");
    const dropdownRef = useRef(null);
    const [challengeName, setChallengeName] = useState('');
    const [challengeDescription, setChallengeDescription] = useState('');
    const [challengeLink, setChallengeLink] = useState('');
    const [challengeDoAmount, setChallengeDoAmount] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [channelId, setChannelId] = useState('');
    const [calculateTotalPrice, setCalculateTotalPrice] = useState(0)
    const [isLoading, setIsLoading] = useState(false);
    const [activeTelegramChallengesConfig, setActiveTelegramChallengesConfig] = useState(null);
    const [checkChannelIdResult, setCheckChannelIdResult] = useState(null);

    const validateForm = () => {
        if (!challengeName.trim()) return false;
        if (!challengeDescription.trim()) return false;
        if (!challengeLink) return false;
        try {
            const url = new URL(challengeLink);
            if (url.protocol !== 'https:') return false;
            const hostname = url.hostname.toLowerCase();
            if (hostname !== 't.me' && hostname !== 'telegram.me' && hostname !== 'www.t.me' && hostname !== 'www.telegram.me') return false;
        } catch {
            return false;
        }
        const amount = Number(challengeDoAmount);
        if (!challengeDoAmount || amount <= 0 || !Number.isInteger(amount)) return false;
        if (checkChannelIdResult !== true) return false;
        if (tonBalance < calculateTotalPrice) return false;
        if (!channelId.startsWith('-100')) return false;
        return true;
    }

    useEffect(() => {
        setIsFormValid(validateForm());
    }, [
        challengeName,
        challengeDescription,
        challengeLink,
        challengeDoAmount,
        checkChannelIdResult,
        tonBalance,
        calculateTotalPrice,
        channelId
    ]);

    const copyTelegramUsername = (telegramUsername) => {
        navigator.clipboard.writeText(telegramUsername)
        showNotification("Юзернейм скопирован", 2000);
    }

    const handleChannleIdChange = (e) => {
        let value = e.target.value;
        const maxLength = 20;
        if (value.length > maxLength) {
            value = value.slice(0, maxLength);
            showError("Максимальная длина ID 20 символов");
        }

        if (!value.startsWith('-100')) {
            showError("ID должен начинаться с -100");
        }
        setChannelId(value);
        setCheckChannelIdResult(null);
    }

    const handleChallengeDoAmountChange = (e) => {
        let value = e.target.value;
        if (value === '' || (/^\d+$/.test(value) && Number(value) > 0)) {
            setChallengeDoAmount(value);
        } else {
            showError("Количество выполнений - целое положительное число");
        }
    }

    const handleChallengeNameChange = (e) => {
        let value = e.target.value;
        const maxLength = 21;
        if (value.length > maxLength) {
            value = value.slice(0, maxLength);
            showError("Максимальная длина названия 21 символ");
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
                }
                const hostname = url.hostname.toLowerCase();
                if (hostname !== 't.me' && hostname !== 'telegram.me' && hostname !== 'www.t.me' && hostname !== 'www.telegram.me') {
                    showError("Ссылка должна быть телеграмовской (https://t.me/...)");
                }
            } catch (_) {
                showError("Введите корректный URL");
            }
        }
    
        setChallengeLink(value);
    };
    

    const handleCheckLink = () => {
        setIsLoading(true);
        setCheckChannelIdResult(null);
        const maxLength = 20;
        if (channelId.length > maxLength) {
            showError("Максимальная длина ID 20 символов");
            setIsLoading(false);
            return;
        }

        if (!channelId.startsWith('-100')) {
            showError("ID должен начинаться с -100");
            setIsLoading(false);
            return;
        }

        const dataRaw = retrieveRawInitData();

        const postData = {
            channelId: channelId
        }

        axios.post('/api/checkchannelid', postData, {
            headers: {
                'Authorization': 'tma ' + dataRaw
            }
        })
        .then(response => {
            setCheckChannelIdResult(response.data);
            setIsLoading(false);
        })
        .catch(error => {
            console.log("Check channel id error: {}", error);
            setIsLoading(false);
        })
    }
    
    const selectedTimesToDtoArgument = (activeTelegramChallegeConfig) => {
        switch (selectedType) {
            case "1": return activeTelegramChallegeConfig.followPrice;
            case "2": return activeTelegramChallegeConfig.viewPrice;
        }
    }

    useEffect(() => {
        setIsLoading(true);
        if (!challengesConfigs?.telegramChallengesConfig) return;
        const activeTelegramChallengesConfigRaw = challengesConfigs.telegramChallengesConfig.find(cfg => cfg.status === "active");
        if (!activeTelegramChallengesConfigRaw) return;
        setActiveTelegramChallengesConfig(activeTelegramChallengesConfigRaw);
        const priceBySelectedType = selectedTimesToDtoArgument(activeTelegramChallengesConfigRaw);
        let doAmount = Number(challengeDoAmount) || 0;
        setCalculateTotalPrice((priceBySelectedType || 0) * doAmount);
        setIsLoading(false);
    }, [challengeDoAmount, challengesConfigs, selectedType]);

    const options = [
        { value: "1", label: "Подписка" },
        { value: "2", label: "Просмотр" }
    ];

    const selectedOption = options.find(opt => opt.value === selectedType);

    const handleCreateChallenge = () => {
        setIsLoading(true);
        const dataRaw = retrieveRawInitData();;
        const postData = {
            challengeName: challengeName,
            challengeDescription: challengeDescription,
            challengeLink: challengeLink,
            channelId: channelId,
            selectedType: selectedType,
            challengeDoAmount: challengeDoAmount,
            challengeType: currentChallenge,
            configId: activeTelegramChallengesConfig.id
        }
        axios.post('/api/challenges', postData, {
            headers: {
                'Authorization': 'tma ' + dataRaw
            }
        })
            .then(response => {
                setChallenges(response.data);
                setTonBalance(response.data.tonBalance);
                setIsLoading(false);
                setChallengeName('');
                setChallengeDescription('');
                setChallengeLink('');
                setSelectedType('1');
                setChannelId('');
                setChallengeDoAmount('');
                setCheckChannelIdResult(null);
                showNotification("Задание отправлено на модерацию");
            })
            .catch(error => {
                console.log("Error creating challenge: {}", error)
                showError("Не удалось создать задание")
                setIsLoading(false);
            })
    }


    const renderCheckChannleIdResult = () => {
        if (checkChannelIdResult === null) {
            return;
        }
        return checkChannelIdResult ? (
            <div className='check-link-result yes'>КАНАЛ ДОСТУПЕН ДЛЯ ВСТРАИВАНИЯ</div>
        ) : (
            <div className='check-link-result no'>ЭТОТ КАНАЛ НЕЛЬЗЯ ДОБАВИТЬ ДЛЯ ЗАДАНИЯ</div>
        )
    }

    return (
        <div className='add-talegram-challenge-form'>
            <div className="add-challenge-form-title">Создать задание телеграм</div>
            <div className="add-telegram-challenge-form-input-container">
                <div className='selector-container'>
                    <div className={`add-telegram-challenge-form-select-container ${isDropdownOpen ? 'open' : ''}`} ref={dropdownRef}>
                        <div className="add-telegram-challenge-form-select" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
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
                </div>
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
                <div className='input-form-info'>Принимаются только открытые каналы</div>
                <input
                    className='add-challenge-form-input'
                    type="text"
                    placeholder="Введите ID канала..."
                    onChange={handleChannleIdChange}
                    value={channelId}
                />
                <div className='input-form-info'>Пример ID канала: -1002364121642</div>
                <input
                    className='add-challenge-form-input'
                    type="text"
                    placeholder="Введите количество выполнений..."
                    onChange={handleChallengeDoAmountChange}
                    value={challengeDoAmount}
                />
            </div>
            <div className='add-telegram-challenge-info'>
                <div className='input-description-info'>Добавьте нашего бота в администраторы своего канала и нажмите кнопку проверить. Это необходимо для проверки выполнения заданий!</div>
                <div>
                    <div className='username-text' onClick={() => copyTelegramUsername('@FreeTonTG_bot')}>@FreeTonTG_bot</div>
                    <div className='input-description-info'>Нажмите чтобы скопировать</div>
                </div>
                <button className='ping-check-button' onClick={handleCheckLink} disabled={isLoading}>ПРОВЕРИТЬ</button>
                {renderCheckChannleIdResult()}
            </div>
            <div className='total-price-container'>
                <div className='total-price-container-title'>К оплате:</div>
                <div className={`total-price-container-price ${tonBalance < calculateTotalPrice ? 'red' : 'green'}`}>{calculateTotalPrice.toFixed(6)}</div>
            </div>
            <div className='add-challenge-form-button-container'>
                <button className='add-challenge-form-button' disabled={isLoading || tonBalance < calculateTotalPrice || !isFormValid} onClick={handleCreateChallenge}>ЗАПУСТИТЬ ЗАДАНИЕ</button>
            </div>
        </div>
    )
}