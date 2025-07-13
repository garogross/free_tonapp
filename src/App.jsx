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
import {
  BrowserRouter as Router,
  Routes,
  Route,
  data
} from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const [currentContent, setCurrentContent] = useState('cran')
  const [profileSubMenu, setProfileSubMenu] = useState('profile')
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [backPath, setBackPath] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true);

  const [transactions, setTransactions] = useState([]);
  const [advertisements, setAdvertisements] = useState([]);
  const [adPackages, setAdPackages] = useState([]);
  const [friends, setFriends] = useState([]);

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

  const { showNotification } = useNotification();
  function lockOrientation() {
    try {
      postEvent('web_app_toggle_orientation_lock', { locked: true });
    } catch (error) {
      console.error('Failed to lock orientation:', error);
    }
  }
  lockOrientation();

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

  useEffect(() => {
    const dataRaw = retrieveRawInitData();
    async function fetchUser() {
      try {
        const response = await axios.get('/api/login', {
          headers: { 'Authorization': 'tma ' + dataRaw }
        });
        setUser(response.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUser();
  }, []);

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
            <RollTable />
            <RollButton isPushed={isPushed} setIsPushed={setIsPushed} setLuckyNumber={setLuckyNumber} setIsAnimating={setIsAnimating} setEndTime={setEndTime} setRollStarted={setRollStarted} setTonBalance={setTonBalance} setLastRollNumber={setLastRollNumber} />
          </div>
        );
      case 'challenges':
        return (
          <>
            <Challenges setCurrentContent={setCurrentContent} tonBalance={tonBalance} />
          </>
        );
      case 'staking':
        return (
          <>
            <Staking setTonBalance={setTonBalance} tonBalance={tonBalance} accelerateBalance={accelerateBalance} accelerateSpeed={accelerateSpeed} setAccelerateBalance={setAccelerateBalance} setAccelerateSpeed={setAccelerateSpeed} />
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
                <AdvertisingCabinet setCurrentContent={setCurrentContent} tonBalance={tonBalance} />
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
            <AddChallengeForm />
          </>
        );
      case 'addPackagesForm':
        return (
          <>
            <AddsPackagesForm setCurrentContent={setCurrentContent} setSelectedPackage={setSelectedPackage} adPackages={adPackages} tonBalance={tonBalance}/>
          </>
        );
      case 'addAddForm':
        return (
          <>
            <AddAddForm selectedPackage={selectedPackage} setAdvertisements={setAdvertisements} setTonBalance={setTonBalance} setProfileSubMenu={setProfileSubMenu} setCurrentContent={setCurrentContent}/>
          </>
        );
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
            <footer>
              <Add setCurrentContent={setCurrentContent} setProfileSubMenu={setProfileSubMenu} />
              <FootMenu setCurrentContent={setCurrentContent} currentContent={currentContent} />
            </footer>
          </TonConnectUIProvider>
        } />
        <Route path="/freetonadmin" element={
          <ProtectedRoute user={user} loadingUser={loadingUser} allowedRoles={['admin']}>
            <AdminApp setCurrentContent={setCurrentContent}/>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App;
