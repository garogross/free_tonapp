import './AddChallengeForm.css';
import { useEffect, useState } from 'react';
import { useNotification } from './useNotification';
import { retrieveRawInitData } from '@telegram-apps/sdk'
import axios from 'axios';
import { useTranslation } from 'react-i18next';


export default function AddChallengeForm({ currentChallenge, challengesConfigs, tonBalance, setChallenges, setTonBalance, challengeForRelaunch, setChallengeForRelaunch }) {
    const { showError, showNotification } = useNotification();
    const [selectedTimes, setSelectedTimes] = useState("10");
    const [challengeName, setChallengeName] = useState('');
    const [challengeDescription, setChallengeDescription] = useState('');
    const [challengeLink, setChallengeLink] = useState('');
    const [challengeDoAmount, setChallengeDoAmount] = useState('');
    const [calculateTotalPrice, setCalculateTotalPrice] = useState(0)
    const [isLoading, setIsLoading] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [checkLinkResult, setCheckLinkResult] = useState(null);
    const [activeSurfingConfig, setActiveSurfingConfig] = useState(null);
    const { t } = useTranslation();

    const validateForm = () => {
        if (!challengeName.trim()) return false;
        if (!challengeDescription.trim()) return false;
        if (!challengeLink) return false;
        try {
            const url = new URL(challengeLink);
            if (url.protocol !== 'https:') return false;
        } catch {
            return false;
        }
        const amount = Number(challengeDoAmount);
        if (!challengeDoAmount || amount <= 0 || !Number.isInteger(amount)) return false;
        if (checkLinkResult !== true) return false;
        if (tonBalance < calculateTotalPrice) return false;
        return true;
    }


    useEffect(() => {
        setIsFormValid(validateForm());
    }, [
        challengeName,
        challengeDescription,
        challengeLink,
        challengeDoAmount,
        checkLinkResult,
        tonBalance,
        calculateTotalPrice
    ]);


    const handleTimesClick = (time) => {
        setSelectedTimes(time);
    }

    useEffect(() => {
        if (challengeForRelaunch && currentChallenge === 'surfing') {
            setChallengeName(challengeForRelaunch.name);
            setChallengeDescription(challengeForRelaunch.description);
            setChallengeLink(challengeForRelaunch.link);
            setSelectedTimes(challengeForRelaunch.timeOfExecution.toString());
            setChallengeForRelaunch(null);
        }
    }, [challengeForRelaunch]);

    const handleChallengeNameChange = (e) => {
        let value = e.target.value;
        const maxLength = 21;
        if (value.length > maxLength) {
            value = value.slice(0, maxLength);
            showError(t('addChallengeForm.maxNameLength'));
        }


        setChallengeName(value);
    }


    const handleChallengeDescriptionChange = (e) => {
        let value = e.target.value;
        const maxLength = 40;
        if (value.length > maxLength) {
            value = value.slice(0, maxLength);
            showError(t('addChallengeForm.maxDescriptionLength'));
        }


        setChallengeDescription(value);
    }


    const handleChallengeLinkChange = (e) => {
        let value = e.target.value;
        const maxLength = 100;
        setIsLoading(false);

        if (value.length > maxLength) {
            value = value.slice(0, maxLength);
            showError(t('addChallengeForm.maxLinkLength'));
        }
        if (value.length > 0) {
            try {
                const url = new URL(value);
                if (url.protocol !== "https:") {
                    showError(t('addChallengeForm.linkMustStartHttps'));
                    return;
                }
            } catch (_) {
                showError(t('addChallengeForm.enterValidUrl'));
            }
        }


        setChallengeLink(value);
    };



    const handleChallengeDoAmountChange = (e) => {
        let value = e.target.value;
        if (value === '' || (/^\d+$/.test(value) && Number(value) > 0)) {
            setChallengeDoAmount(value);
        } else {
            showError(t('addChallengeForm.amountPositiveInteger'));
        }
    }


    const titleCurrentChalengeToName = (currentChallenge) => {
        switch (currentChallenge) {
            case 'surfing': return t('addChallengeForm.surfing');
            case 'telegram': return t('addChallengeForm.telegram');
            default: return t('addChallengeForm.surfing');
        }
    }


    const selectedTimesToDtoArgumen = (activeSurfingConfig) => {
        if (!activeSurfingConfig) return 9999;
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
        const activeSurfingConfigRaw = challengesConfigs.surfingConfigs.find(cfg => cfg.status === "active");
        if (!activeSurfingConfigRaw) return;
        setActiveSurfingConfig(activeSurfingConfigRaw);
        const priceBySelectedTimes = selectedTimesToDtoArgumen(activeSurfingConfigRaw);
        let doAmount = Number(challengeDoAmount) || 0;
        setCalculateTotalPrice((priceBySelectedTimes || 0) * doAmount);
        setIsLoading(false);
    }, [selectedTimes, challengeDoAmount, challengesConfigs]);


    const handleCheckLink = () => {
        const maxLength = 100;
        if (challengeLink.length > maxLength) {
            showError(t('addChallengeForm.maxLinkLength'));
            return;
        }
        if (challengeLink.length > 0) {
            try {
                const url = new URL(challengeLink);
                if (url.protocol !== "https:") {
                    showError(t('addChallengeForm.linkMustStartHttps'));
                    return;
                }
            } catch (_) {
                showError(t('addChallengeForm.enterValidUrl'));
                return;
            }
        } else {
            showError(t('addChallengeForm.enterLink'));
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


    const handleCreateChallenge = () => {
        setIsLoading(true);
        const dataRaw = retrieveRawInitData();;
        const postData = {
            challengeName: challengeName,
            challengeDescription: challengeDescription,
            challengeLink: challengeLink,
            selectedTimes: selectedTimes,
            challengeDoAmount: challengeDoAmount,
            challengeType: currentChallenge,
            configId: activeSurfingConfig.id
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
                setSelectedTimes('10');
                setChallengeDoAmount('');
                setCheckLinkResult(null);
                showNotification(t('addChallengeForm.challengeSentForModeration'));
            })
            .catch(error => {
                console.log("Error creating challenge: {}", error)
                showError(t('addChallengeForm.failedToCreate'));
                setIsLoading(false);
            })
    }


    const renderCheckLinkResult = () => {
        if (checkLinkResult === null) {
            return;
        }
        return checkLinkResult ? (
            <div className='check-link-result yes'>{t('addChallengeForm.linkAvailableForEmbedding')}</div>
        ) : (
            <div className='check-link-result no'>{t('addChallengeForm.cantAddThisLink')}</div>
        )
    }


    return (
        <div className="add-challenge-form">
            <div className="add-challenge-form-title">{t('addChallengeForm.createChallenge')} {titleCurrentChalengeToName(currentChallenge)}</div>
            <div className="add-challenge-form-input-container">
                <input
                    className='add-challenge-form-input'
                    type="text"
                    placeholder={t('addChallengeForm.namePlaceholder')}
                    onChange={handleChallengeNameChange}
                    value={challengeName}
                />
                <textarea
                    className='add-challenge-form-input'
                    type="text"
                    placeholder={t('addChallengeForm.descriptionPlaceholder')}
                    onChange={handleChallengeDescriptionChange}
                    value={challengeDescription}
                />
                <input
                    className='add-challenge-form-input'
                    type="text"
                    placeholder={t('addChallengeForm.linkPlaceholder')}
                    onChange={handleChallengeLinkChange}
                    value={challengeLink}
                />
                <div className='link-ping-check'>{t('addChallengeForm.checkWebsiteStep')}</div>
                <button className='ping-check-button' onClick={handleCheckLink} disabled={isLoading}>{t('addChallengeForm.checkSite')}</button>
                {renderCheckLinkResult()}
                <div className='times-container-title'>{t('addChallengeForm.timeOnSiteTitle')}</div>
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
                    placeholder={t('addChallengeForm.doAmountPlaceholder')}
                    onChange={handleChallengeDoAmountChange}
                    value={challengeDoAmount}
                />
            </div>
            <div className='total-price-container'>
                <div className='total-price-container-title'>{t('addChallengeForm.toPay')}:</div>
                <div className={`total-price-container-price ${tonBalance < calculateTotalPrice ? 'red' : 'green'}`}>{calculateTotalPrice.toFixed(6)}</div>
            </div>
            <div className='add-challenge-form-button-container'>
                <button className='add-challenge-form-button' disabled={isLoading || tonBalance < calculateTotalPrice || !isFormValid} onClick={handleCreateChallenge}>{t('addChallengeForm.launchChallenge')}</button>
            </div>
        </div>
    )
}
