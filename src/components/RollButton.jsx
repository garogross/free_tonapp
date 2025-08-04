import './RollButton.css';
import axios from 'axios';
import { retrieveRawInitData } from '@telegram-apps/sdk';
import { useNotification } from './useNotification';
import { useEffect, useState } from 'react';

export default function RollButton( props ) {
  const { showError } = useNotification();
  const [rollSuccesfullResponse, setRollSuccessfullResponse] = useState(null);

  useEffect(() => {
    if (!props.isAnimating && rollSuccesfullResponse != null) {
      props.setLuckyNumber(rollSuccesfullResponse.luckyNumber);
      props.setTonBalance(rollSuccesfullResponse.tonBalance);
      props.setLastRollNumber(rollSuccesfullResponse.luckyNumber);
      props.setIsPushed(true);
    }
  }, [props.isAnimating])

  const getRoll = () => {
    props.setIsPushed(true);
    props.setIsAnimating(true);
    props.setRollStarted(true);

    const dataRaw = retrieveRawInitData();
    axios.get('/api/roll', {
      headers: {
        'Authorization': 'tma ' + dataRaw
      }
    })
      .then(response => {
        setRollSuccessfullResponse(response.data);
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
        props.setEndTime(oneHourLater);
      })
      .catch(error => {
        if (error.response && error.response.status === 429) {
          showError("Попробуйте через час");
        } else {
          showError(error.message || error);
        }
        props.setRollStarted(false);
        props.setIsAnimating(false);
      })
  }

  return (
    <div class="roll-button-wrapper">
      <button className={`roll-button ${props.isPushed ? 'pushed' : ''}`} onClick={() => getRoll()} disabled={props.isPushed}>
        <span className="roll-button-text">ROLL</span>
        <div className={`roll-button-shadow ${props.isPushed ? 'pushed' : ''}`}></div>
      </button>
    </div>
  )
}