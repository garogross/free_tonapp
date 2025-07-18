import './Challenges.css';
import tonIcon from '../assets/ton.svg';
import { useEffect, useState } from 'react';
import catImage from '../assets/cat.png';
import smallTonIcon from '../assets/small_ton.svg';
import { useNotification } from './useNotification';

export default function Challenges({ setCurrentContent, tonBalance, currentChallenge, setCurrentChallenge, challenges }) {
    const [isClient, setIsClient] = useState(false);
    const [surfingChallenges, setSurfingChallenges] = useState([]);
    const [ownedSurfingChallenges, setOwnedSurfingChallenges] = useState([]);
    const { showNotification } = useNotification();

    useEffect(() => {
        if (!challenges) return;
        setSurfingChallenges(challenges.activeSurfingChalleges);
        setOwnedSurfingChallenges(challenges.ownedSurfingChallenges);
    }, [challenges]);

    const handleClientSwitch = () => {
        setIsClient(!isClient);
    }

    const statusToMean = (status) => {
        switch (status) {
            case "moderation": return "МОДЕРИРУЕТСЯ";
            case "active": return "ЗАПУЩЕНО";
            case "deprecated": return "ЗАКОНЧЕНО";
            case "deny": return "ОТКЛОНЕНО";
        }
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
                    <div className="empty-message">Список заданий пуст</div>
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
                        <div className="challenge-item-text">ВРЕМЯ: </div>
                        <div className="challenge-item-text challenge-time-of-execution">{sc.timeOfExecution} сек</div>
                    </div>
                    <span className="challenge-item-payment">
                        <div className="challenge-item-text challege-price">{sc.price.toFixed(7)}</div>
                        <img src={smallTonIcon} alt="TON" />
                    </span>
                    <button className="challenge-surf-button">ПОСЕТИТЬ</button>
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
                                <button className="add-challenges-button" onClick={() => setCurrentContent('addChallengeForm')}>Добавить задание</button>
                            </div>
                        </>
                    );
                    case 'telegram': return (
                        <>
                            <div className="no-clients-challenges-title">Список заданий пуст</div>
                            <div className="add-challenges-button-container">
                                <button className="add-challenges-button" onClick={() => setCurrentContent('addChallengeForm')}>Добавить задание</button>
                            </div>
                        </>
                    );
                }
            case false:
                switch (currentChallenge) {
                    case 'surfing':
                        return <div className="no-clients-challenges-title">{renderSurfingChallengesTable()}</div>;
                    case 'telegram':
                        return <div className="no-clients-challenges-title">Список заданий пуст</div>;
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
                    <div className="balance-title">Баланс</div>
                    <div className="value-container">
                        <div className="balance-value">{tonBalance.toFixed(6)}</div>
                        <div className="balance-icon">
                            <img src={tonIcon} alt="TON" />
                        </div>
                    </div>
                </div>
                <div className="client-switch-container">
                    <div className="client-switch-title">Я заказчик</div>
                    <div className={`client-switch ${isClient ? 'active' : ''}`} onClick={handleClientSwitch}></div>
                </div>
            </div>
            <div className="challenges-menu-container">
                <button className={`challenges-menu-button ${currentChallenge === 'surfing' ? 'active' : ''}`} onClick={() => setCurrentChallenge('surfing')}>Серфинг</button>
                <button className={`challenges-menu-button ${currentChallenge === 'telegram' ? 'active' : ''}`} onClick={() => setCurrentChallenge('telegram')}>Телеграм</button>
                <button className={`challenges-menu-button ${currentChallenge === 'youtube' ? 'active' : ''}`} onClick={() => setCurrentChallenge('youtube')}>YouTube</button>
                <button className={`challenges-menu-button ${currentChallenge === 'reviews' ? 'active' : ''}`} onClick={() => setCurrentChallenge('reviews')}>Отзывы</button>
            </div>
            {renderChallenges()}
        </div>
    )
}