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
  const [rollStarted, setRollStarted] = useState(false);

  const intervalRef = useRef(null);

  function parseDateTime(dtString) {
    const [datePart, timePart] = dtString.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute, second] = timePart.split(':').map(Number);
    
    return new Date(year, month - 1, day, hour, minute, second);
  } 

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
    async function checkIsRollAvailable() {
      const dataRaw = retrieveRawInitData();
      axios.get('/api/checkroll', {
        headers: {
          'Authorization': 'tma ' + dataRaw
        }
      })
      .then(response => {
        setIsPushed(!response.data.isAvailable);
        const endDateTime = parseDateTime(response.data.endTime);
        setEndTime(endDateTime);
      })
      .catch(error => {
        console.error('Check is roll available error: ', error);
      })
    }
    checkIsRollAvailable();
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
        setBackPath('profile')
        break;
      case 'cashInRequest':
        setBackPath('cashIn')
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
            <Rullet currentContent={currentContent} gridRow="1" luckyNumber={isAnimating ? displayNumber : luckyNumber} isPushed={isPushed} endTime={endTime} setIsPushed={setIsPushed} rollStarted={rollStarted} setRollStarted={setRollStarted}/>
            <RollTable />
            <RollButton isPushed={isPushed} setIsPushed={setIsPushed} setLuckyNumber={setLuckyNumber} setIsAnimating={setIsAnimating} setEndTime={setEndTime} setRollStarted={setRollStarted}/>
            <Add />
          </> 
        );
      case 'challenges':
        return (
          <>
            <Challenges setCurrentContent={setCurrentContent} />
            <Add />
          </>
        );
      case 'staking':
        return (
          <>
            <Staking />
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
                <Rullet currentContent={currentContent} gridRow="2" setCurrentContent={setCurrentContent} luckyNumber={null} isPushed={true} endTime={endTime} setIsPushed={setIsPushed} rollStarted={rollStarted}/>
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
                <AdvertisingCabinet setCurrentContent={setCurrentContent}/>
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
    <div className="app-container">
      <Header setCurrentContent={setCurrentContent} path={backPath} />
      <main className="main-content">
        {renderContent()}
      </main>
      <FootMenu setCurrentContent={setCurrentContent} currentContent={currentContent}/>
    </div>
  )
}

export default App;
