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
import { retrieveLaunchParams, retrieveRawInitData, postEvent } from '@telegram-apps/sdk'
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import './App.css'
import axios from 'axios'
import { useNotification } from './components/useNotification'
import ProtectedRoute from './components/ProtectedRoute'
import AdminApp from './components/AdminApp'
import AddTelegramChallengeForm from './components/AddTelegramChallengeForm'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  data
} from "react-router-dom";
import SecureIframe from './components/SecureIframe'
import './i18n';

function App({ user, loadingUser }) {
  const [currentContent, setCurrentContent] = useState('cran')
  const [profileSubMenu, setProfileSubMenu] = useState('profile')
  const [currentChallenge, setCurrentChallenge] = useState('surfing');
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [backPath, setBackPath] = useState(null)
  const [blockedSlots, setBlockedSlots] = useState(0);
  const [challenges, setChallenges] = useState(null);

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [activeAds, setActiveAds] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [advertisements, setAdvertisements] = useState([]);
  const [adPackages, setAdPackages] = useState([]);
  const [friends, setFriends] = useState([]);
  const [initialNumbers, setInitialNumbers] = useState([]);

  const [isPushed, setIsPushed] = useState(true)
  const [luckyNumber, setLuckyNumber] = useState(null)
  const [displayNumber, setDisplayNumber] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [endTime, setEndTime] = useState(0)
  const timeoutRef = useRef(null);
  const [rollStarted, setRollStarted] = useState(false)
  const [lastRollNumber, setLastRollNumber] = useState(0)
  const [challengesConfigs, setChallengesConfigs] = useState(null);
  const [acceleratorsStatus, setAcceleratorsStatus] = useState(false);

  const [tonBalance, setTonBalance] = useState(0)

  const intervalRef = useRef(null);

  const [accelerateSpeed, setAccelerateSpeed] = useState(0.00000013);
  const [accelerateBalance, setAccelerateBalance] = useState(0.00000000);
  const stompClient = useRef(null);
  const [currentSurfingChallenge, setCurrentSurfingChallenge] = useState(null);

  const { showNotification } = useNotification();
  function lockOrientation() {
    try {
      postEvent('web_app_toggle_orientation_lock', { locked: true });
    } catch (error) {
      console.error('Failed to lock orientation:', error);
    }
  }
  lockOrientation();

  const isMobileDevice = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

  useEffect(() => {
    if (!isMobileDevice) return;

    const onFocusIn = (event) => {
      const tagName = event.target.tagName.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea') {
        setKeyboardVisible(true);
      }
    };

    const onFocusOut = (event) => {
      const tagName = event.target.tagName.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea') {
        setKeyboardVisible(false);
      }
    };

    window.addEventListener('focusin', onFocusIn);
    window.addEventListener('focusout', onFocusOut);

    return () => {
      window.removeEventListener('focusin', onFocusIn);
      window.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  async function getInitialNumbers(dataRaw) {
    axios.get('/api/prizestable', {
      headers: {
        'Authorization': 'tma ' + dataRaw
      }
    })
      .then(response => {
        setInitialNumbers(response.data.prizesTable);
      }
      )
      .catch(error => {
        console.error('Get prizes table error: ', error);
      })
  }

  async function getChallegesConfigs(dataRaw) {
    axios.get('/api/challengesconfigs', {
      headers: {
        'Authorization': 'tma ' + dataRaw
      }
    })
      .then(response => {
        setChallengesConfigs(response.data)
      })
      .catch(error => {
        console.error('Get challeges configs error: ', error);
      })
  }

  async function getChalleges(dataRaw) {
    axios.get('/api/challenges', {
      headers: {
        'Authorization': 'tma ' + dataRaw
      }
    })
      .then(response => {
        setChallenges(response.data)
      })
      .catch(error => {
        console.error('Get challenges error: ', error);
      })
  }

  async function getActiveAds(dataRaw) {
    axios.get('/api/activeads', {
      headers: {
        'Authorization': 'tma ' + dataRaw
      }
    })
      .then(response => {
        setActiveAds(response.data.advertisements);
        setBlockedSlots(response.data.blockedSlots);
      }
      )
      .catch(error => {
        console.error('Get active advertisements error: ', error);
      })
  }

  async function getTransactions(dataRaw) {
    axios.get('/api/transactions', {
      headers: {
        'Authorization': 'tma ' + dataRaw
      }
    })
      .then(response => {
        setTransactions(response.data.transactions);
      }
      )
      .catch(error => {
        console.error('Get transactions error: ', error);
      })
  }

  async function getAdPackages(dataRaw) {
    axios.get('/api/adpackages', {
      headers: {
        'Authorization': 'tma ' + dataRaw
      }
    })
      .then(response => {
        setAdPackages(response.data.adPackages);
      }
      )
      .catch(error => {
        console.error('Get adpackages error: ', error);
      })
  }

  async function getAdvertisements(dataRaw) {
    axios.get('/api/advertisement', {
      headers: {
        'Authorization': 'tma ' + dataRaw
      }
    })
      .then(response => {
        setAdvertisements(response.data.advertisements);
        setTonBalance(response.data.tonBalance);
      }
      )
      .catch(error => {
        console.error('Get advertisements error: ', error);
      })
  }

  async function getFriends(dataRaw) {
    axios.get('/api/friends', {
      headers: {
        'Authorization': 'tma ' + dataRaw
      }
    })
      .then(response => {
        setFriends(response.data.friends);
      }
      )
      .catch(error => {
        console.error('Get friends error: ', error);
      })
  }

  async function getAcceleratorsStatus(dataRaw) {
    axios.get('/api/accelerators', {
      headers: {
        'Authorization': 'tma ' + dataRaw
      }
    })
      .then(response => {
        setAcceleratorsStatus(response.data.acceleratorsConfig[0].acceleratorsStatus)
      })
      .catch(error => {
        console.error('Get accelerators error: ', error);
      });
  }

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
          showNotification("Баланс пополнен");
          getTransactions(dataRaw);
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message']);
      },
      onDisconnect: () => {
        console.log('Disconnected');
      },
      onWebSocketClose: () => {
        console.log('WebSocket closed, trying to reconnect...');
        setTimeout(() => stompClient.current.activate(), 5000);
      },
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    stompClient.current.activate();

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };const timeoutRef = useRef(null);
  }, []);

  useEffect(() => {
    if (rollStarted) {
      setIsAnimating(true);
      intervalRef.current = setInterval(() => {
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        setDisplayNumber(randomNum);
      }, 100);

      timeoutRef.current = setTimeout(() => {
        clearInterval(intervalRef.current);
        setDisplayNumber(luckyNumber);
        setIsAnimating(false);
      }, 3000);
      return () => {
        clearInterval(intervalRef.current);
        clearTimeout(timeoutRef.current);
      };
    }
  }, [rollStarted, luckyNumber]);

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
    getChalleges(dataRaw);
    getChallegesConfigs(dataRaw);
    getAcceleratorsStatus(dataRaw);
    getInitialNumbers(dataRaw);
    getActiveAds(dataRaw);
    getAdPackages(dataRaw);
    getAdvertisements(dataRaw);
    getAccelerateBalance(dataRaw);
    getFriends(dataRaw);
    getTransactions(dataRaw);
  }, []);

  const addTransaction = (newTx) => {
    setTransactions(prevTransactions => [newTx, ...prevTransactions]);
  };

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
      case 'addTelegramChallengeForm':
      case 'secureIframe':
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
          <div className="cran-wrapper">
            <Rullet currentContent={currentContent} gridRow="1" luckyNumber={isAnimating ? displayNumber : luckyNumber} isPushed={isPushed} endTime={endTime} setIsPushed={setIsPushed} rollStarted={rollStarted} setRollStarted={setRollStarted} tonBalance={tonBalance} lastRollNumber={lastRollNumber} />
            <RollTable initialNumbers={initialNumbers} />
            <RollButton isPushed={isPushed} setIsPushed={setIsPushed} setLuckyNumber={setLuckyNumber} setIsAnimating={setIsAnimating} setEndTime={setEndTime} setRollStarted={setRollStarted} setTonBalance={setTonBalance} setLastRollNumber={setLastRollNumber} />
          </div>
        );
      case 'challenges':
        return (
          <>
            <Challenges setCurrentContent={setCurrentContent} tonBalance={tonBalance} currentChallenge={currentChallenge} setCurrentChallenge={setCurrentChallenge} challenges={challenges} setTonBalance={setTonBalance} setChallenges={setChallenges} setCurrentSurfingChallenge={setCurrentSurfingChallenge} />
          </>
        );
      case 'staking':
        return (
          <>
            <Staking setTonBalance={setTonBalance} tonBalance={tonBalance} accelerateBalance={accelerateBalance} accelerateSpeed={accelerateSpeed} setAccelerateBalance={setAccelerateBalance} setAccelerateSpeed={setAccelerateSpeed} friends={friends} acceleratorsStatus={acceleratorsStatus} setAcceleratorsStatus={setAcceleratorsStatus} />
          </>
        );
      case 'friends':
        return (
          <>
            <Friends friends={friends} />
          </>
        );
      case 'profile':
        switch (profileSubMenu) {
          case 'profile':
            return (
              <>
                <ProfileMenu profileSubMenu={profileSubMenu} setProfileSubMenu={setProfileSubMenu} />
                <Rullet currentContent={currentContent} gridRow="2" setCurrentContent={setCurrentContent} luckyNumber={null} isPushed={true} endTime={endTime} setIsPushed={setIsPushed} rollStarted={rollStarted} setRollStarted={setRollStarted} tonBalance={tonBalance} lastRollNumber={lastRollNumber} />
                <TransactionTable transactions={transactions} />
              </>
            );
          case 'advertising':
            return (
              <>
                <ProfileMenu profileSubMenu={profileSubMenu} setProfileSubMenu={setProfileSubMenu} />
                <AdvertisingCabinet setCurrentContent={setCurrentContent} tonBalance={tonBalance} advertisements={advertisements} adPackages={adPackages} />
              </>
            );
        }
      case 'cashIn':
        return (
          <>
            <CashInForm setCurrentContent={setCurrentContent} />
          </>
        );
      case 'cashInRequest':
        return (
          <>
            <CashInRequestForm setCurrentContent={setCurrentContent} addTransaction={addTransaction} />
          </>
        );
      case 'cashOut':
        return (
          <>
            <CashOutForm tonBalance={tonBalance} setTonBalance={setTonBalance} setTransactions={setTransactions} />
          </>
        );
      case 'addChallengeForm':
        return (
          <>
            <AddChallengeForm currentChallenge={currentChallenge} challengesConfigs={challengesConfigs} tonBalance={tonBalance} setChallenges={setChallenges} setTonBalance={setTonBalance} />
          </>
        );
      case 'addPackagesForm':
        return (
          <>
            <AddsPackagesForm setCurrentContent={setCurrentContent} setSelectedPackage={setSelectedPackage} adPackages={adPackages} tonBalance={tonBalance} />
          </>
        );
      case 'addAddForm':
        return (
          <>
            <AddAddForm selectedPackage={selectedPackage} setAdvertisements={setAdvertisements} setTonBalance={setTonBalance} setProfileSubMenu={setProfileSubMenu} setCurrentContent={setCurrentContent} blockedSlots={blockedSlots} />
          </>
        );
      case 'addTelegramChallengeForm':
        return (
          <>
            <AddTelegramChallengeForm tonBalance={tonBalance} challengesConfigs={challengesConfigs} currentChallenge={currentChallenge} setTonBalance={setTonBalance} setChallenges={setChallenges} />
          </>
        )
      case 'secureIframe':
        return (
          <>
            <SecureIframe currentSurfingChallenge={currentSurfingChallenge} setCurrentContent={setCurrentContent} setChallenges={setChallenges} setTonBalance={setTonBalance} />
          </>
        )
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <TonConnectUIProvider manifestUrl="https://freeton-back.ru.tuna.am/tonconnect-manifest.json">
            <header>
              <Header setCurrentContent={setCurrentContent} path={backPath} />
            </header>
            <main>
              {renderContent()}
            </main>
            <footer className={keyboardVisible ? 'hidden' : ''}>
              <Add setCurrentContent={setCurrentContent} setProfileSubMenu={setProfileSubMenu} activeAds={activeAds} />
              <FootMenu setCurrentContent={setCurrentContent} currentContent={currentContent} />
            </footer>
          </TonConnectUIProvider>
        } />
        <Route path="/freetonadmin" element={
          <ProtectedRoute user={user} loadingUser={loadingUser} allowedRoles={['admin']}>
            <AdminApp setCurrentContent={setCurrentContent} adPackages={adPackages} setAdPackages={setAdPackages} initialNumbers={initialNumbers} setInitialNumbers={setInitialNumbers} challengesConfig={challengesConfigs} setChallengesConfig={setChallengesConfigs} keyboardVisible={keyboardVisible} />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App;
