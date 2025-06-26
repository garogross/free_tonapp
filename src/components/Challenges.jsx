import './Challenges.css';
import tonIcon from '../assets/ton.svg';
import { useState } from 'react';
import catImage from '../assets/cat.png';

export default function Challenges( {setCurrentContent, tonBalance} ) {
    const [currentChallenge, setCurrentChallenge] = useState('surfing');
    const [isClient, setIsClient] = useState(false);

    const handleClientSwitch = () => {
        setIsClient(!isClient);
    }

    const renderChallenges = () => {
        switch (isClient) {
            case true:
                return (
                    <>
                        <div className="no-clients-challenges-title">Список заданий пуст</div>
                        <button className="add-challenges-button" onClick={() => setCurrentContent('addChallengeForm')}>Добавить задание</button>
                    </>
                )
            case false:
                switch (currentChallenge) {
                    case 'surfing':
                        return <div className="no-clients-challenges-title">Список заданий пуст</div>;
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