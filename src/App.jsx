import { Client } from "@stomp/stompjs";
import {
  postEvent,
  retrieveLaunchParams,
  retrieveRawInitData,
} from "@telegram-apps/sdk";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import SockJS from "sockjs-client";
import { api } from "./api/axios";
import styles from "./App.module.scss";
import AdBanner from "./components/AdBanner";
import AddAddForm from "./components/AddAddForm";
import AddChallengeForm from "./components/AddChallengeForm";
import AddsPackagesForm from "./components/AddsPackagesForm";
import AddTelegramChallengeForm from "./components/AddTelegramChallengeForm";
import AdminApp from "./components/AdminApp";
import AdvertisingCabinet from "./components/AdvertisingCabinet";
import CashInForm from "./components/CashInForm";
import CashInRequestForm from "./components/CashInRequestForm";
import CashOutForm from "./components/CashOutForm";
import Challenges from "./components/Challenges";
import Cran from "./components/Cran";
import FootMenu from "./components/FootMenu";
import Friends from "./components/Friends";
import Header from "./components/Header";
import Profile from "./components/Profile/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import SecureIframe from "./components/SecureIframe";
import Staking from "./components/Staking";
import { useNotification } from "./components/useNotification";
import "./i18n";

function App({ user, loadingUser }) {
  const [currentContent, setCurrentContent] = useState("cran");
  const [profileSubMenu, setProfileSubMenu] = useState("profile");
  const [currentChallenge, setCurrentChallenge] = useState("surfing");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [backPath, setBackPath] = useState(null);
  const [blockedSlots, setBlockedSlots] = useState(0);
  const [challenges, setChallenges] = useState(null);

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [quests, setQuests] = useState([]);
  const [activeAds, setActiveAds] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [advertisements, setAdvertisements] = useState([]);
  const [adPackages, setAdPackages] = useState([]);
  const [friends, setFriends] = useState([]);
  const [initialNumbers, setInitialNumbers] = useState([]);
  const [isSkipAvailable, setIsSkipAvailable] = useState(true);
  const [skipEndTime, setSkipEndTime] = useState(0);
  const [starsMode] = useState(true);
  const [course, setCourse] = useState(0);

  const [isPushed, setIsPushed] = useState(true);
  const [luckyNumber, setLuckyNumber] = useState(null);
  const [displayNumber, setDisplayNumber] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [endTime, setEndTime] = useState(0);
  const timeoutRef = useRef(null);
  const luckyNumberRef = useRef(null);
  const [rollStarted, setRollStarted] = useState(false);
  const [challengesConfigs, setChallengesConfigs] = useState(null);
  const [acceleratorsStatus, setAcceleratorsStatus] = useState(false);
  const [challengeForRelaunch, setChallengeForRelaunch] = useState(null);

  const [tonBalance, setTonBalance] = useState(0);

  const intervalRef = useRef(null);
  const [isSubscriber, setIsSubscriber] = useState(false);

  const [accelerateSpeed, setAccelerateSpeed] = useState(0.00000013);
  const [accelerateBalance, setAccelerateBalance] = useState(0.0);
  const stompClient = useRef(null);
  const [currentSurfingChallenge, setCurrentSurfingChallenge] = useState(null);
  const [_skipTimeLeft, setSkipTimeLeft] = useState(0);

  const { showNotification } = useNotification();
  function lockOrientation() {
    try {
      postEvent("web_app_toggle_orientation_lock", { locked: true });
    } catch (error) {
      console.error("Failed to lock orientation:", error);
    }
  }
  lockOrientation();

  const isMobileDevice =
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
      navigator.userAgent,
    );

  useEffect(() => {
    if (!isMobileDevice) return;

    const onFocusIn = (event) => {
      const tagName = event.target.tagName.toLowerCase();
      if (tagName === "input" || tagName === "textarea") {
        setKeyboardVisible(true);
      }
    };

    const onFocusOut = (event) => {
      const tagName = event.target.tagName.toLowerCase();
      if (tagName === "input" || tagName === "textarea") {
        setKeyboardVisible(false);
      }
    };

    window.addEventListener("focusin", onFocusIn);
    window.addEventListener("focusout", onFocusOut);

    return () => {
      window.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("focusout", onFocusOut);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Rewrite this effect according to instructions ---
  // fix logic to stop when diff <= 0 && isPushed == true, and restart otherwise
  useEffect(() => {
    let intervalId;

    function updateTimeLeft() {
      const now = new Date();
      const diff = Math.floor((new Date(skipEndTime) - now) / 1000);
      // If the skip time has ended AND isPushed is true, stop and enable skip
      if (diff <= 0 && isPushed === true) {
        setSkipTimeLeft(0);
        setIsSkipAvailable(true);

        // stop interval if running
        if (intervalId) {
          clearInterval(intervalId);
        }
      } else {
        setSkipTimeLeft(diff);
        // If we got here and interval is not yet set, set it (handled by setInterval in this effect)
      }
    }

    // Only run if skip is currently unavailable
    if (!isSkipAvailable) {
      updateTimeLeft();
      intervalId = setInterval(() => {
        updateTimeLeft();
      }, 1000);
    }

    // Clean up the interval
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [skipEndTime, isPushed, isSkipAvailable]);
  // --- End rewrite ---

  async function getInitialNumbers() {
    api
      .get("/api/prizestable")
      .then((response) => {
        setInitialNumbers(response.data.prizesTable);
      })
      .catch((error) => {
        console.error("Get prizes table error: ", error);
      });
  }

  async function checkSub() {
    api
      .get("/api/check/subscription")
      .then((response) => {
        setIsSubscriber(response.data);
      })
      .catch((error) => {
        console.log("error check subscription: {}", error);
      });
  }

  async function getChallegesConfigs() {
    api
      .get("/api/challengesconfigs")
      .then((response) => {
        setChallengesConfigs(response.data);
      })
      .catch((error) => {
        console.error("Get challeges configs error: ", error);
      });
  }

  async function getCourse() {
    api
      .get("/api/course")
      .then((response) => {
        setCourse(response.data.starsPerTon);
      })
      .catch((error) => {
        console.error("Get stars course error: ", error);
      });
  }

  async function getChalleges() {
    api
      .get("/api/challenges")
      .then((response) => {
        setChallenges(response.data);
      })
      .catch((error) => {
        console.error("Get challenges error: ", error);
      });
  }

  async function getActiveAds() {
    api
      .get("/api/activeads")
      .then((response) => {
        setActiveAds(response.data.advertisements);
        setBlockedSlots(response.data.blockedSlots);
      })
      .catch((error) => {
        console.error("Get active advertisements error: ", error);
      });
  }

  async function getTransactions() {
    api
      .get("/api/transactions")
      .then((response) => {
        setTransactions(response.data.transactions);
      })
      .catch((error) => {
        console.error("Get transactions error: ", error);
      });
  }

  async function getAdPackages() {
    api
      .get("/api/adpackages")
      .then((response) => {
        setAdPackages(response.data.adPackages);
      })
      .catch((error) => {
        console.error("Get adpackages error: ", error);
      });
  }

  async function getAdvertisements() {
    api
      .get("/api/advertisement")
      .then((response) => {
        setAdvertisements(response.data.advertisements);
        setTonBalance(response.data.tonBalance);
      })
      .catch((error) => {
        console.error("Get advertisements error: ", error);
      });
  }

  async function getFriends() {
    api
      .get("/api/friends")
      .then((response) => {
        setFriends(response.data.friends);
      })
      .catch((error) => {
        console.error("Get friends error: ", error);
      });
  }

  async function getAcceleratorsStatus() {
    api
      .get("/api/accelerators")
      .then((response) => {
        setAcceleratorsStatus(
          response.data.acceleratorsConfig[0].acceleratorsStatus,
        );
      })
      .catch((error) => {
        console.error("Get accelerators error: ", error);
      });
  }

  useEffect(() => {
    let dataRaw;
    try {
      dataRaw = retrieveRawInitData();
    } catch (error) {
      console.error("Error retrieving raw init data:", error);
      dataRaw = null;
    }
    const socket = new SockJS("/ws");

    stompClient.current = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        "X-Authorization": "tma " + dataRaw,
      },
      onConnect: () => {
        console.log("Connected");
        stompClient.current.subscribe("/user/queue/balance", (message) => {
          const body = JSON.parse(message.body);
          setTonBalance(body.tonBalance);
          showNotification("Баланс пополнен");
          getTransactions(dataRaw);
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
      },
      onDisconnect: () => {
        console.log("Disconnected");
      },
      onWebSocketClose: () => {
        console.log("WebSocket closed, trying to reconnect...");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (rollStarted) {
      setIsAnimating(true);
      intervalRef.current = setInterval(() => {
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        setDisplayNumber(randomNum);
      }, 100);

      timeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
        clearInterval(intervalRef.current);
        setDisplayNumber(luckyNumber);
        luckyNumberRef.current = setTimeout(() => {
          setRollStarted(false);
        }, 3000);
      }, 3000);
      return () => {
        clearInterval(intervalRef.current);
        clearTimeout(timeoutRef.current);
        clearTimeout(luckyNumberRef.current);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rollStarted]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAccelerateBalance((prevBalance) => prevBalance + accelerateSpeed);
    }, 1000);

    return () => clearInterval(interval);
  }, [accelerateSpeed]);

  useEffect(() => {
    async function checkIsRollAvailable() {
      api
        .get("/api/checkroll")
        .then((response) => {
          setIsPushed(!response.data.isAvailable);
          const endDateTime = new Date(response.data.endTime);
          const skipEndDateTime = new Date(response.data.skipEndTime);
          setEndTime(endDateTime);
          setSkipEndTime(skipEndDateTime);
          setIsSkipAvailable(response.data.isSkipAvailable);
        })
        .catch((error) => {
          console.error("Check is roll available error: ", error);
        });
    }
    checkIsRollAvailable();

    async function getTonBalance() {
      api
        .get("/api/balance")
        .then((response) => {
          setTonBalance(response.data.tonBalance);
        })
        .catch((error) => {
          console.error("Getting ton balance error: ", error);
        });
    }
    getTonBalance();

    async function getAccelerateBalance() {
      api
        .get("/api/acceleratebalance")
        .then((response) => {
          setAccelerateBalance(response.data.accelerateBalance);
          setAccelerateSpeed(response.data.accelerateSpeed);
        })
        .catch((error) => {
          console.error("Getting accelerate balance error: ", error);
        });
    }
    async function getQuests() {
      api
        .get("/api/quests")
        .then((response) => {
          // {
          //   "questType": "faucet_collect",
          //   "name": "Faucet Collect",
          //   "level": 3,
          //   "targetValue": 15,
          //   "currentValue": 12,
          //   "reward": 15,
          //   "completed": false
          // }[]
          setQuests(response.data.quests);
        })
        .catch((error) => {
          console.error("Getting accelerate balance error: ", error);
        });
    }
    getChalleges();
    getChallegesConfigs();
    getAcceleratorsStatus();
    getInitialNumbers();
    getActiveAds();
    getAdPackages();
    getCourse();
    checkSub();
    getAdvertisements();
    getAccelerateBalance();
    getFriends();
    getTransactions();
    getQuests();
  }, []);

  const addTransaction = (newTx) => {
    setTransactions((prevTransactions) => [newTx, ...prevTransactions]);
  };

  const initData = useMemo(() => {
    let data;
    try {
      data = retrieveLaunchParams();
    } catch (error) {
      console.error("Error retrieving launch params:", error);
      data = null;
    }

    return data;
  }, []);

  useEffect(() => {
    console.log("Component mounted with:", initData);

    switch (currentContent) {
      case "cran":
      case "challenges":
      case "staking":
      case "friends":
      case "profile":
        setBackPath("None");
        break;
      case "cashIn":
      case "addPackagesForm":
      case "cashOut":
      case "cashInRequest":
        setBackPath("profile");
        break;
      case "addTelegramChallengeForm":
      case "secureIframe":
      case "addChallengeForm":
        setBackPath("challenges");
        break;
      case "addAddForm":
        setBackPath("addPackagesForm");
        break;
      default:
        setBackPath("None");
    }
  }, [currentContent, initData]);

  const renderContent = () => {
    switch (currentContent) {
      case "cran":
        return (
          <Cran
            setSkipEndTime={setSkipEndTime}
            isSkipAvailable={isSkipAvailable}
            setIsSkipAvailable={setIsSkipAvailable}
            isPushed={isPushed}
            setIsPushed={setIsPushed}
            setLuckyNumber={setLuckyNumber}
            setIsAnimating={setIsAnimating}
            setEndTime={setEndTime}
            setRollStarted={setRollStarted}
            setTonBalance={setTonBalance}
            isAnimating={isAnimating}
            currentContent={currentContent}
            displayNumber={displayNumber}
            luckyNumber={luckyNumber}
            endTime={endTime}
            rollStarted={rollStarted}
            initialNumbers={initialNumbers}
            course={course}
          />
        );
      case "challenges":
        return (
          <>
            <Challenges
              setCurrentContent={setCurrentContent}
              currentChallenge={currentChallenge}
              setCurrentChallenge={setCurrentChallenge}
              challenges={challenges}
              setTonBalance={setTonBalance}
              setChallenges={setChallenges}
              setCurrentSurfingChallenge={setCurrentSurfingChallenge}
              setIsSubscriber={setIsSubscriber}
              isSubscriber={isSubscriber}
              setChallengeForRelaunch={setChallengeForRelaunch}
              course={course}
            />
          </>
        );
      case "staking":
        return (
          <>
            <Staking
              setTonBalance={setTonBalance}
              tonBalance={tonBalance}
              accelerateBalance={accelerateBalance}
              accelerateSpeed={accelerateSpeed}
              setAccelerateBalance={setAccelerateBalance}
              setAccelerateSpeed={setAccelerateSpeed}
              friends={friends}
              acceleratorsStatus={acceleratorsStatus}
              setAcceleratorsStatus={setAcceleratorsStatus}
              setIsSubscriber={setIsSubscriber}
              isSubscriber={isSubscriber}
              starsMode={starsMode}
              course={course}
            />
          </>
        );
      case "friends":
        return (
          <>
            <Friends friends={friends} course={course} />
          </>
        );
      case "profile":
        switch (profileSubMenu) {
          case "profile":
            return (
              <>
                <Profile
                  setProfileSubMenu={setProfileSubMenu}
                  setCurrentContent={setCurrentContent}
                  quests={quests}
                  setQuests={setQuests}
                  setTonBalance={setTonBalance}
                />
              </>
            );

          case "advertising":
            return (
              <>
                <AdvertisingCabinet
                  setCurrentContent={setCurrentContent}
                  setProfileSubMenu={setProfileSubMenu}
                  tonBalance={tonBalance}
                  advertisements={advertisements}
                  adPackages={adPackages}
                  course={course}
                  starsMode={starsMode}
                />
              </>
            );
        }
        break;
      case "cashIn":
        return (
          <>
            <CashInForm setCurrentContent={setCurrentContent} />
          </>
        );
      case "cashInRequest":
        return (
          <>
            <CashInRequestForm
              setCurrentContent={setCurrentContent}
              addTransaction={addTransaction}
            />
          </>
        );

      case "cashOut":
        return (
          <>
            <CashOutForm
              tonBalance={tonBalance}
              setTonBalance={setTonBalance}
              setTransactions={setTransactions}
              starsMode={starsMode}
              course={course}
              transactions={transactions}
              goBack={() => setCurrentContent("profile")}
            />
          </>
        );
      case "addChallengeForm":
        return (
          <>
            <AddChallengeForm
              currentChallenge={currentChallenge}
              challengesConfigs={challengesConfigs}
              tonBalance={tonBalance}
              setChallenges={setChallenges}
              setTonBalance={setTonBalance}
              challengeForRelaunch={challengeForRelaunch}
              setChallengeForRelaunch={setChallengeForRelaunch}
              goBack={() => setCurrentContent("challenges")}
            />
          </>
        );
      case "addPackagesForm":
        return (
          <>
            <AddsPackagesForm
              setCurrentContent={setCurrentContent}
              setSelectedPackage={setSelectedPackage}
              adPackages={adPackages}
              tonBalance={tonBalance}
            />
          </>
        );
      case "addAddForm":
        return (
          <>
            <AddAddForm
              selectedPackage={selectedPackage}
              setAdvertisements={setAdvertisements}
              setTonBalance={setTonBalance}
              setProfileSubMenu={setProfileSubMenu}
              setCurrentContent={setCurrentContent}
              blockedSlots={blockedSlots}
            />
          </>
        );
      case "addTelegramChallengeForm":
        return (
          <>
            <AddTelegramChallengeForm
              tonBalance={tonBalance}
              challengesConfigs={challengesConfigs}
              currentChallenge={currentChallenge}
              setTonBalance={setTonBalance}
              setChallenges={setChallenges}
              challengeForRelaunch={challengeForRelaunch}
              setChallengeForRelaunch={setChallengeForRelaunch}
            />
          </>
        );
      case "secureIframe":
        return (
          <>
            <SecureIframe
              currentSurfingChallenge={currentSurfingChallenge}
              setCurrentContent={setCurrentContent}
              setChallenges={setChallenges}
              setTonBalance={setTonBalance}
            />
          </>
        );
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <TonConnectUIProvider manifestUrl="https://freeton-back.ru.tuna.am/tonconnect-manifest.json">
              <div className={styles.app}>
                <Header
                  setCurrentContent={setCurrentContent}
                  path={backPath}
                  tonBalance={tonBalance}
                />
                <main className={styles.app__main}>{renderContent()}</main>
                <footer className={keyboardVisible ? "hidden" : "container"}>
                  <AdBanner
                    setCurrentContent={setCurrentContent}
                    setProfileSubMenu={setProfileSubMenu}
                    activeAds={activeAds}
                  />
                  <FootMenu
                    setCurrentContent={setCurrentContent}
                    currentContent={currentContent}
                  />
                </footer>
              </div>
            </TonConnectUIProvider>
          }
        />
        <Route
          path="/freetonadmin"
          element={
            <ProtectedRoute
              user={user}
              loadingUser={loadingUser}
              allowedRoles={["admin"]}
            >
              <AdminApp
                setCurrentContent={setCurrentContent}
                adPackages={adPackages}
                setAdPackages={setAdPackages}
                initialNumbers={initialNumbers}
                setInitialNumbers={setInitialNumbers}
                challengesConfig={challengesConfigs}
                setChallengesConfig={setChallengesConfigs}
                keyboardVisible={keyboardVisible}
                course={course}
                setCourse={setCourse}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
