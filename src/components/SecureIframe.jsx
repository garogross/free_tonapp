import React, { useState, useEffect } from 'react';
import './SecureIframe.css';
import { useNotification } from './useNotification';
import { retrieveRawInitData } from '@telegram-apps/sdk';
import axios from 'axios';

const SecureIframe = ({ currentSurfingChallenge, setCurrentContent, setChallenges, setTonBalance }) => {
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(9999);
  const { showError, showNotification } = useNotification();

  useEffect(() => {
    setLoading(true);
    setTimeLeft(currentSurfingChallenge.timeOfExecution);
  }, [currentSurfingChallenge]);

  useEffect(() => {
    if (!loading && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [loading, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleEndOfTime(currentSurfingChallenge.id);
    }
  }, [timeLeft]);

  const handleEndOfTime = () => {
    setCurrentContent('challenges');
    const dataRaw = retrieveRawInitData();
    const postData = {
      id: currentSurfingChallenge.id
    };
    axios.post('/api/challenge/iframeend', postData, {
      headers: {
        'Authorization': 'tma ' + dataRaw
      }
    })
      .then(response => {
        setChallenges(response.data);
        setTonBalance(response.data.tonBalance);
        showNotification('Успешно выполнено');
      })
      .catch(error => {
        console.error("error view telegram challenge: ", error);
        showError('Не удалось выполнить');
      });
  };

  const handleStartOfTime = (id) => {
    const dataRaw = retrieveRawInitData();
    const postData = {
      id: id
    };
    axios.post('/api/challenge/iframestart', postData, {
      headers: {
        'Authorization': 'tma ' + dataRaw
      }
    })
      .then(response => {
        showNotification('Оставайтесь на странице');
      })
      .catch(error => {
        console.error("error view telegram challenge: ", error);
        showError('Не удалось начать');
        setCurrentContent('challenges');
      });
  };

  return (
    <div className="iframeContainer">
      {loading && (
        <div className="loadingPlaceholder">
          Загружается...
        </div>
      )}
      {!loading && timeLeft > 0 && (
        <div className="pretty-timer-challenge">
          <div className="timer-block-challenge">
            <div className="timer-label-challenge">Оставшееся время</div>
            <div className="timer-digits-challenge">
              <span className="timer-digit-challenge">{Math.floor(timeLeft / 10)}</span>
              <span className="timer-digit-challenge">{timeLeft % 10}</span>
            </div>
            <span className="timer-separator-challenge">секунд</span>
          </div>
        </div>
      )}
      <iframe
        src={currentSurfingChallenge.link}
        title={currentSurfingChallenge.name}
        className={`iframeStyle ${loading || timeLeft === 0 ? 'iframeHidden' : ''}`}
        sandbox="allow-scripts allow-forms"
        loading="lazy"
        allow="fullscreen"
        onLoad={() => {
          setLoading(false);
          handleStartOfTime(currentSurfingChallenge.id);
        }}
      />
      {!loading && timeLeft === 0 && (
        <div style={{ marginTop: 16, color: '#78AA28', fontWeight: '700' }}>
          Время просмотра истекло
        </div>
      )}
    </div>
  );
};

export default SecureIframe;
