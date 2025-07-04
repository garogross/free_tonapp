import { useState, useEffect, useMemo, useRef } from 'react'
import RollButton from './components/RollButton'
import FootMenu from './components/FootMenu'
import Header from './components/Header'
import Rullet from './components/Rullet'
import RollTable from './components/RollTable'
import Add from './components/Add'
import ProfileMenu from './components/ProfileMenu'
import TransactionTable from './components/TransactionTable'
import AdvertisingCabinet from './components/AdvertisingCabinet'
import Friends from './components/Friends'
import Staking from './components/Staking'
import CashInForm from './components/CashInForm'
import CashInRequestForm from './components/CashInRequestForm'
import CashOutForm from './components/CashOutForm'
import Challenges from './components/Challenges'
import AddChallengeForm from './components/AddChallengeForm'
import AddsPackagesForm from './components/AddsPackagesForm'
import AddAddForm from './components/AddAddForm'
import { retrieveLaunchParams, retrieveRawInitData } from '@telegram-apps/sdk'
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import './App.css'
import axios from 'axios'

function App() {
  const [currentContent, setCurrentContent] = useState('cran')
  const [profileSubMenu, setProfileSubMenu] = useState('profile')
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [backPath, setBackPath] = useState(null)

  const [isPushed, setIsPushed] = useState(true)
  const [luckyNumber, setLuckyNumber] = useState(null)
  const [displayNumber, setDisplayNumber] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [endTime, setEndTime] = useState(0)
  const [rollStarted, setRollStarted] = useState(false)
  const [lastRollNumber, setLastRollNumber] = useState(0)
  
  const [tonBalance, setTonBalance] = useState(0)

  const intervalRef = useRef(null);

  const [accelerateSpeed, setAccelerateSpeed] = useState(0.00000033);
  const [accelerateBalance, setAccelerateBalance] = useState(0.00000000);
  const stompClient = useRef(null);

  useEffect(() => {
    const dataRaw = retrieveRawInitData();
    const socket = new SockJS('/ws');

    stompClient.current = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        'X-Authorization': 'tma ' + dataRaw,
      },
      onConnect: () => {
        console.log('Connected');
        stompClient.current.subscribe('/user/queue/balance', (message) => {
          const body = JSON.parse(message.body);
          setTonBalance(body.tonBalance);
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message']);
      },
    });

    stompClient.current.activate();

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, []);

  useEffect(() => {
    if (isAnimating) {
      intervalRef.current = setInterval(() => {
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        setDisplayNumber(randomNum);
      }, 100);
    } else {
      clearInterval(intervalRef.current);
      setDisplayNumber(luckyNumber);
    }

    return () => clearInterval(intervalRef.current);
  }, [isAnimating, luckyNumber]);

  useEffect(() => {
    const interval = setInterval(() => {
        setAccelerateBalance(prevBalance => prevBalance + accelerateSpeed);
    }, 1000);

    return () => clearInterval(interval);
  }, [accelerateSpeed]);

  useEffect(() => {
    const dataRaw = retrieveRawInitData();
    async function checkIsRollAvailable(dataRaw) {
      axios.get('/api/checkroll', {
        headers: {
          'Authorization': 'tma ' + dataRaw
        }
      })
      .then(response => {
        setIsPushed(!response.data.isAvailable);
        const endDateTime = new Date(response.data.endTime);
        setEndTime(endDateTime);
        setLastRollNumber(response.data.lastRollNumber);
      })
      .catch(error => {
        console.error('Check is roll available error: ', error);
      })
    }
    checkIsRollAvailable(dataRaw);

    async function getTonBalance(dataRaw) {
      axios.get('/api/balance', {
        headers: {
          'Authorization': 'tma ' + dataRaw
        }
      })
      .then(response => {
        setTonBalance(response.data.tonBalance);
      })
      .catch(error => {
        console.error('Getting ton balance error: ', error);
      })
    }
    getTonBalance(dataRaw);

    async function getAccelerateBalance(dataRaw) {
      axios.get('/api/acceleratebalance', {
        headers: {
          'Authorization': 'tma ' + dataRaw
        }
      })
      .then(response => {
        setAccelerateBalance(response.data.accelerateBalance);
        setAccelerateSpeed(response.data.accelerateSpeed);
      })
      .catch(error => {
        console.error('Getting accelerate balance error: ', error);
      })
    }
    getAccelerateBalance(dataRaw);
  }, []);

  const initData = useMemo(() => {
    const data = retrieveLaunchParams();
    const dataRaw = retrieveRawInitData();
    console.log('Init data received: ', data);
    console.log('Init raw data', dataRaw);
    return data;
  }, []);

  useEffect(() => {

    console.log('Component mounted with:', initData);

    switch (currentContent) {
      case 'cran':
      case 'challenges':
      case 'staking':
      case 'friends':
      case 'profile':
        setBackPath('None')
        break;
      case 'cashIn':
      case 'addPackagesForm':
      case 'cashOut':
      case 'cashInRequest':
        setBackPath('profile')
        break;
      case 'addChallengeForm':
        setBackPath('challenges')
        break;
      case 'addAddForm':
        setBackPath('addPackagesForm')
        break;
      default:
        setBackPath('None')
    }
  }, [currentContent, initData])

  const renderContent = () => {
    switch (currentContent) {
      case 'cran':
        return (
          <>
            <Rullet currentContent={currentContent} gridRow="1" luckyNumber={isAnimating ? displayNumber : luckyNumber} isPushed={isPushed} endTime={endTime} setIsPushed={setIsPushed} rollStarted={rollStarted} setRollStarted={setRollStarted} tonBalance={tonBalance} lastRollNumber={lastRollNumber}/>
            <RollTable />
            <RollButton isPushed={isPushed} setIsPushed={setIsPushed} setLuckyNumber={setLuckyNumber} setIsAnimating={setIsAnimating} setEndTime={setEndTime} setRollStarted={setRollStarted} setTonBalance={setTonBalance} setLastRollNumber={setLastRollNumber}/>
            <Add />
          </> 
        );
      case 'challenges':
        return (
          <>
            <Challenges setCurrentContent={setCurrentContent} tonBalance={tonBalance}/>
            <Add />
          </>
        );
      case 'staking':
        return (
          <>
            <Staking setTonBalance={setTonBalance} tonBalance={tonBalance} accelerateBalance={accelerateBalance} accelerateSpeed={accelerateSpeed} setAccelerateBalance={setAccelerateBalance} setAccelerateSpeed={setAccelerateSpeed}/>
            <Add />
          </>
        );
      case 'friends':
        return (
          <>
           <Friends />
           <Add />
          </>
        );
      case 'profile':
        switch (profileSubMenu) {
          case 'profile':
            return (
              <>
                <ProfileMenu profileSubMenu={profileSubMenu} setProfileSubMenu={setProfileSubMenu}/>
                <Rullet currentContent={currentContent} gridRow="2" setCurrentContent={setCurrentContent} luckyNumber={null} isPushed={true} endTime={endTime} setIsPushed={setIsPushed} rollStarted={rollStarted} setRollStarted={setRollStarted} tonBalance={tonBalance} lastRollNumber={lastRollNumber}/>
                <div className="last-transactions">Последние транзакции</div>
                <div className="transaction-column-names">
                  <div className="transaction-column-name">Дата</div>
                  <div className="transaction-column-name">Тип</div>
                  <div className="transaction-column-name">Сумма</div>
                  <div className="transaction-column-name">Статус</div>
                </div>
                <TransactionTable />
                <Add />
              </>
            );
          case 'advertising':
            return (
              <>
                <AdvertisingCabinet setCurrentContent={setCurrentContent} tonBalance={tonBalance}/>
                <ProfileMenu profileSubMenu={profileSubMenu} setProfileSubMenu={setProfileSubMenu}/>
                <Add />
              </>
            );
        }
      case 'cashIn':
        return (
          <>
            <CashInForm setCurrentContent={setCurrentContent}/>
            <Add />
          </>
        );
      case 'cashInRequest':
        return (
          <>
            <CashInRequestForm />
            <Add />
          </>
        );
      case 'cashOut':
        return (
          <>
            <CashOutForm />
            <Add />
          </>
        );
      case 'addChallengeForm':
        return (
          <>
            <AddChallengeForm />
            <Add />
          </>
        );
      case 'addPackagesForm':
        return (
          <>
            <AddsPackagesForm setCurrentContent={setCurrentContent} setSelectedPackage={setSelectedPackage} />
            <Add />
          </>
        );
      case 'addAddForm':
        return (
          <>
            <AddAddForm selectedPackage={selectedPackage} />
            <Add />
          </>
        );
    }
  };

  return (
    <TonConnectUIProvider manifestUrl="https://freeton-back.ru.tuna.am/tonconnect-manifest.json">
    <div className="app-container">
      <Header setCurrentContent={setCurrentContent} path={backPath} />
      <main className="main-content">
        {renderContent()}
      </main>
      <FootMenu setCurrentContent={setCurrentContent} currentContent={currentContent}/>
    </div>
    </TonConnectUIProvider>
  )
}

export default App;
