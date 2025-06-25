import './Rullet.css';
import tonIcon from '../assets/ton.svg';
import { useState, useEffect } from 'react';

export default function Rullet({ currentContent, gridRow, setCurrentContent, luckyNumber, isPushed, endTime, setIsPushed, rollStarted, setRollStarted, tonBalance, lastRollNumber }) {

    const [showTimer, setShowTimer] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);

    const getLuckyDigits = (number) => {
    if (number === null) return Array(5).fill('--');
    const digits = number.toString().padStart(5, '0').split('');
    return digits;
    }

    const digits = getLuckyDigits(luckyNumber);

    useEffect(() => {
        if (isPushed) {
          setShowTimer(false);
          if (!rollStarted) {
            setShowTimer(true);
            return;
          }
          const timeoutId = setTimeout(() => {
            setShowTimer(true);
            setRollStarted(false);
          }, 3000);
          return () => clearTimeout(timeoutId);
        } else {
          setShowTimer(false);
        }
      }, [rollStarted, isPushed]);
      

    useEffect(() => {
        if (!showTimer) return;

        function updateTimeLeft() {
            const now = new Date();
            const diff = Math.floor((new Date(endTime) - now) / 1000);
            if (diff <= 0) {
                setTimeLeft(0);
                setShowTimer(false);
                setIsPushed(false);
            } else {
                setTimeLeft(diff);
            }
        }
        updateTimeLeft();

        const intervalId = setInterval(updateTimeLeft, 1000);
        return () => clearInterval(intervalId);
    }, [showTimer, endTime]);

    const formatTime = (seconds) => {
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
      };

    return (
        <div className="rullet" grid-row={gridRow}>
            <div className="rullet-title">Ваш баланс</div>
            <div className="rullet-balance">
                <div className="rullet-balance-value">{tonBalance.toFixed(6)}</div>
                <div className="rullet-balance-icon">
                    <img src={tonIcon} alt="TON" />
                </div>
            </div>
            {currentContent === 'cran' && (
                <>
                    <div className="rullet-subtitle">{isPushed ? 'Время сбора' : 'Выпавшее число'}</div>
                    <div className={`rullet-result-container ${isPushed  && !rollStarted ? 'pushed' : ''}`}>
                        {showTimer ? (
                            <>
                                <div className="rullet-timer">{formatTime(timeLeft)}</div>
                            </>
                        ) : (
                        <>
                            <div className="rullet-result-number-item1">{digits[0]}</div>
                            <div className="rullet-result-number-item2">{digits[1]}</div>
                            <div className="rullet-result-number-item3">{digits[2]}</div>
                            <div className="rullet-result-number-item4">{digits[3]}</div>
                            <div className="rullet-result-number-item5">{digits[4]}</div>
                        </>
                        )}
                    </div>
                    {showTimer && (
                        <div className="rullet-last-roll-number">Выпало: {lastRollNumber}</div>
                    )}
                </>
            )}
            {currentContent === 'profile' && (
                <>
                    <button className="cash-in" onClick={() => setCurrentContent('cashIn')}>ПОПОЛНИТЬ</button>
                    <button className="cash-out" onClick={() => setCurrentContent('cashOut')}>ВЫВЕСТИ</button>
                </>
            )}
        </div>
    );
}