import './Challenges.css';
import tonIcon from '../assets/ton.svg';
import { useEffect, useState } from 'react';
import catImage from '../assets/cat.png';
import smallTonIcon from '../assets/small_ton.svg';
import { useNotification } from './useNotification';
import { openLink, retrieveRawInitData } from '@telegram-apps/sdk';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function Challenges({ setCurrentContent, tonBalance, currentChallenge, setCurrentChallenge, challenges, setTonBalance, setChallenges, setCurrentSurfingChallenge }) {
    const [isClient, setIsClient] = useState(false);
    const [surfingChallenges, setSurfingChallenges] = useState([]);
    const [ownedSurfingChallenges, setOwnedSurfingChallenges] = useState([]);
    const [telegramChallenges, setTelegramChallenges] = useState([]);
    const [ownedTelegramChallenges, setOwnedTelegramChallenges] = useState([]);
    const { showNotification, showError } = useNotification();
    const { t } = useTranslation();

    const getTypeMeaning = (type) => {
        switch (type) {
            case "1": return t('challengeButtonFollow');
            case "2": return t('challengeButtonView');
        }
    }

    const getTypeButton = (type) => {
        switch (type) {
            case "1": return t('challengeButtonCheck');
            case "2": return t('challengeButtonIframe');
        }
    }

    const handleTelegramChallengeClick = (challengeLink, type, id) => {
        if (!challengeLink || challengeLink.length === 0) return;

        if (openLink.isAvailable()) {
            openLink(challengeLink);
        }
        if (type === 'view') {
            const dataRaw = retrieveRawInitData();
            const postData = {
                id: id
            }
            axios.post('/api/challenge/view', postData, {
                headers: {
                    'Authorization': 'tma ' + dataRaw
                }
            })
                .then(response => {
                    setChallenges(response.data);
                    setTonBalance(response.data.tonBalance);
                    showNotification(t('notification.successfullChallenge'));
                })
                .catch(error => {
                    console.log("error view telegram challenge: {}", error)
                    showError(t('notification.failed'));
                })
        }
    };

    useEffect(() => {
        if (!challenges) return;
        setSurfingChallenges(challenges.activeSurfingChalleges);
        setOwnedSurfingChallenges(challenges.ownedSurfingChallenges);
        setTelegramChallenges(challenges.activeTelegramChallenges)
        setOwnedTelegramChallenges(challenges.ownedTelegramChallenges)
    }, [challenges]);

    const handleClientSwitch = () => {
        setIsClient(!isClient);
    }

    const statusToMean = (status) => {
        switch (status) {
            case "moderation": return t('status.moderation');
            case "active": return t('status.active');
            case "deprecated": return t('status.deprecated');
            case "deny": return t('status.deny');
        }
    }

    const handleTelegramChallengeCheck = (id) => {
        const dataRaw = retrieveRawInitData();
        const postData = {
            id: id
        }
        axios.post('/api/challenge/follow', postData, {
            headers: {
                'Authorization': 'tma ' + dataRaw
            }
        })
            .then(response => {
                setChallenges(response.data);
                setTonBalance(response.data.tonBalance);
                showNotification(t('notification.successfullChallenge'));
            })
            .catch(error => {
                console.log("error view telegram challenge: {}", error)
                showError(t('notification.failed'));
            })
    }

    const handleSurfingChallengeClick = (sc) => {
        setCurrentSurfingChallenge(sc);
        setCurrentContent('secureIframe');
    }

    const renderTelegramChallengesTable = () => {
        let table = [];
        switch (isClient) {
            case true:
                table = ownedTelegramChallenges;
                break;
            case false:
                table = telegramChallenges;
                break;
        }
        if (!table || table.length === 0) {
            return (
                <div className="empty-wrapper">
                    <div className="empty-message">{t('emptyList')}</div>
                </div>
            );
        }
        return table.map((sc, index) =>
            <div className="challenge-row" key={sc.id || index} onClick={() => handleTelegramChallengeClick(sc.link)}>
                <div className="challenge-row-sub start">
                    <div className={`challenge-item-text ${sc.status}`}>{isClient ? statusToMean(sc.status) : ''}</div>
                    <div className="challenge-item-text challenge-name">{sc.name}</div>
                    <div className="challenge-item-text challenge-description" onClick={() => showNotification(sc.description)}>{sc.description}</div>
                </div>
                <div className="challenge-row-sub end">
                    <div className="challenge-time-container">
                        <div className="challenge-item-text">{t('typeTitle')} </div>
                        <div className="challenge-item-text challenge-time-of-execution">{getTypeMeaning(sc.selectedType)}</div>
                    </div>
                    <span className="challenge-item-payment">
                        <div className="challenge-item-text challege-price">{sc.price.toFixed(7)}</div>
                        <img src={smallTonIcon} alt="TON" />
                    </span>
                    {isClient ? (
                        <>
                            <button className="challenge-surf-button" onClick={(e) => {
                                e.stopPropagation();
                            }}>{getTypeButton(sc.selectedType)}</button>
                        </>
                    ) : sc.selectedType === "1" ? (
                        <>
                            <button className="challenge-surf-button" onClick={(e) => {
                                e.stopPropagation();
                                handleTelegramChallengeCheck(sc.id);
                            }}>{t('challengeButtonCheck')}</button>
                        </>
                    ) : (
                        <>
                            <button className="challenge-surf-button" onClick={(e) => {
                                handleTelegramChallengeClick(sc.link, 'view', sc.id);
                            }}>{t('challengeButtonIframe')}</button>
                        </>
                    )}
                </div >
            </div >
        );
    }

    const renderSurfingChallengesTable = () => {
        let table = [];
        switch (isClient) {
            case true:
                table = ownedSurfingChallenges;
                break;
            case false:
                table = surfingChallenges;
                break;
        }
        if (!table || table.length === 0) {
            return (
                <div className="empty-wrapper">
                    <div className="empty-message">{t('emptyList')}</div>
                </div>
            );
        }
        return table.map((sc, index) =>
            <div className="challenge-row" key={sc.id || index}>
                <div className="challenge-row-sub start">
                    <div className={`challenge-item-text ${sc.status}`}>{isClient ? statusToMean(sc.status) : ''}</div>
                    <div className="challenge-item-text challenge-name">{sc.name}</div>
                    <div className="challenge-item-text challenge-description" onClick={() => showNotification(sc.description)}>{sc.description}</div>
                </div>
                <div className="challenge-row-sub end">
                    <div className="challenge-time-container">
                        <div className="challenge-item-text">{t('timeTitle')}</div>
                        <div className="challenge-item-text challenge-time-of-execution">{sc.timeOfExecution} сек</div>
                    </div>
                    <span className="challenge-item-payment">
                        <div className="challenge-item-text challege-price">{sc.price.toFixed(7)}</div>
                        <img src={smallTonIcon} alt="TON" />
                    </span>
                    {isClient ? (
                        <>
                            <button className="challenge-surf-button" onClick={() =>handleTelegramChallengeClick(sc.link)}>{t('challengeButtonGoIn')}</button>
                        </>
                    ) : (
                        <>
                            <button className="challenge-surf-button" onClick={() => handleSurfingChallengeClick(sc)}>{t('challengeButtonGoIn')}</button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    const renderChallenges = () => {
        switch (isClient) {
            case true:
                switch (currentChallenge) {
                    case 'youtube': return <div><img className="content-not-found" src={catImage} alt="Telegram" /></div>;
                    case 'reviews': return <div><img className="content-not-found" src={catImage} alt="Telegram" /></div>;
                    case 'surfing': return (
                        <>
                            <div className="no-clients-challenges-title">{renderSurfingChallengesTable()}</div>
                            <div className="add-challenges-button-container">
                                <button className="add-challenges-button" onClick={() => setCurrentContent('addChallengeForm')}>{t('addChallengeButton')}</button>
                            </div>
                        </>
                    );
                    case 'telegram': return (
                        <>
                            <div className="no-clients-challenges-title">{renderTelegramChallengesTable()}</div>
                            <div className="add-challenges-button-container">
                                <button className="add-challenges-button" onClick={() => setCurrentContent('addTelegramChallengeForm')}>{t('addChallengeButton')}</button>
                            </div>
                        </>
                    );
                }
            case false:
                switch (currentChallenge) {
                    case 'surfing':
                        return <div className="no-clients-challenges-title">{renderSurfingChallengesTable()}</div>;
                    case 'telegram':
                        return <div className="no-clients-challenges-title">{renderTelegramChallengesTable()}</div>;
                    case 'youtube':
                        return <div><img className="content-not-found" src={catImage} alt="YouTube" /></div>;
                    case 'reviews':
                        return <div><img className="content-not-found" src={catImage} alt="Telegram" /></div>;
                }
        }
    }

    return (
        <div className="challenges-container">
            <div className="challenges-top">
                <div className="balance-container">
                    <div className="balance-title">{t('balanceTitle')}</div>
                    <div className="value-container">
                        <div className="balance-value">{tonBalance.toFixed(6)}</div>
                        <div className="balance-icon">
                            <img src={tonIcon} alt="TON" />
                        </div>
                    </div>
                </div>
                <div className="client-switch-container">
                    <div className="client-switch-title">{t('clientTitle')}</div>
                    <div className={`client-switch ${isClient ? 'active' : ''}`} onClick={handleClientSwitch}></div>
                </div>
            </div>
            <div className="challenges-menu-container">
                <button className={`challenges-menu-button ${currentChallenge === 'surfing' ? 'active' : ''}`} onClick={() => setCurrentChallenge('surfing')}>{t('surfingTitle')}</button>
                <button className={`challenges-menu-button ${currentChallenge === 'telegram' ? 'active' : ''}`} onClick={() => setCurrentChallenge('telegram')}>{t('telegramTitle')}</button>
                <button className={`challenges-menu-button ${currentChallenge === 'youtube' ? 'active' : ''}`} onClick={() => setCurrentChallenge('youtube')}>YouTube</button>
                <button className={`challenges-menu-button ${currentChallenge === 'reviews' ? 'active' : ''}`} onClick={() => setCurrentChallenge('reviews')}>{t('feedbackTitle')}</button>
            </div>
            {renderChallenges()}
        </div>
    )
}