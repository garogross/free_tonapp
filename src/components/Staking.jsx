import { useState, useEffect, useMemo } from 'react';
import './Staking.css'
import starsminer from '/assets/star-miner.png'
import miner from '/assets/miner.png'
import miner2 from '/assets/miner2.png'
import { retrieveRawInitData, retrieveLaunchParams } from '@telegram-apps/sdk'
import MinerAnimation from './MinerAnimation';
import axios from 'axios';
import { useNotification } from './useNotification';
import { useTranslation } from 'react-i18next';
import ChannelFollow from './ChannelFollow';

const globalMinerImageCache = window.__minerImageCache || (window.__minerImageCache = {
    loadedByMode: { normal: false, stars: false },
    imagesByMode: { normal: [], stars: [] }
});

export default function Staking({ setTonBalance, tonBalance, accelerateBalance, accelerateSpeed, setAccelerateBalance, setAccelerateSpeed, friends, acceleratorsStatus, setAcceleratorsStatus, setIsSubscriber, isSubscriber, starsMode, course }) {
    const [counter, setCounter] = useState(1);
    const [selectedAccelerator, setSelectedAccelerator] = useState(0);
    const [showAccelerateModal, setShowAccelerateModal] = useState(false);
    const [amountsByType, setAmountsByType] = useState([0, 0, 0]);
    const [isAcceleratorsLoading, setIsAcceleratorsLoading] = useState(false);
    const [modalPage, setModalPage] = useState('accelerators');
    const [acceleratorsConfig, setAcceleratorsConfig] = useState([]);
    const [acceleratorsList, setAcceleratorsList] = useState([]);
    const imageUrls = useMemo(
        () => (starsMode ? [starsminer, miner2] : [miner, miner2]),
        [starsMode]
    );
    const { showError, showNotification } = useNotification();

    const initData = retrieveLaunchParams();
    const userId = initData.tgWebAppData.user.id;
    const { t } = useTranslation();

    const cacheKey = starsMode ? 'stars' : 'normal';
    const [imagesLoaded, setImagesLoaded] = useState(
        globalMinerImageCache.loadedByMode[cacheKey]
    );
    const [cachedImages, setCachedImages] = useState(
        globalMinerImageCache.imagesByMode[cacheKey]
    );

    const writeLinkInClipboard = () => {
        navigator.clipboard.writeText("https://t.me/Freetoon_bot?start=" + userId);
        showNotification(t('friends.linkCopied'), 1000);
    };

    useEffect(() => {
        // если уже есть кэш для текущего режима — используем
        if (globalMinerImageCache.loadedByMode[cacheKey]) {
          setCachedImages(globalMinerImageCache.imagesByMode[cacheKey]);
          setImagesLoaded(true);
          return;
        }
    
        let isCancelled = false;
    
        const preload = async () => {
          try {
            // предзагрузка текущего набора
            const cachedImagePromises = imageUrls.map(async (src) => {
              const res = await fetch(src);
              const blob = await res.blob();
              return URL.createObjectURL(blob);
            });
    
            const urls = await Promise.all(cachedImagePromises);
            if (isCancelled) return;
    
            setCachedImages(urls);
            setImagesLoaded(true);
    
            globalMinerImageCache.loadedByMode[cacheKey] = true;
            globalMinerImageCache.imagesByMode[cacheKey] = urls;
          } catch (e) {
            if (isCancelled) return;
            // в фолбэке всё равно подставляем текущий набор
            setCachedImages(imageUrls);
            setImagesLoaded(true);
    
            globalMinerImageCache.loadedByMode[cacheKey] = true;
            globalMinerImageCache.imagesByMode[cacheKey] = imageUrls;
          }
        };
    
        preload();
    
        return () => {
          isCancelled = true;
        };
      }, [cacheKey, imageUrls]);

    const getUnfund = () => {
        if (accelerateBalance >= 0.5) {
            const dataRaw = retrieveRawInitData();
            axios.get('/api/accelerateunfund', {
                headers: {
                    'Authorization': 'tma ' + dataRaw
                }
            })
                .then(response => {
                    setTonBalance(response.data.tonBalance);
                    setAccelerateBalance(response.data.accelerateBalance);
                    setAccelerateSpeed(response.data.accelerateSpeed);
                })
                .catch(error => {
                    console.error('Unfund accelerate balance error: ', error);
                })
        } else {
            showError(t('stakingForm.requestWithdrawMin'));
        }
    }

    const rentMiner = (rentCount, selectedAccelerator, isAcceleratorsLoading, totalRentPrice, amountBuyedAccelerators) => {
        if (!(isAcceleratorsLoading || totalRentPrice > tonBalance || rentCount === 0)) {
            setIsAcceleratorsLoading(true);
            const postData = {
                rentCount: rentCount,
                type: selectedAccelerator
            }
            const dataRaw = retrieveRawInitData();

            axios.post('/api/accelerators', postData,
                {
                    headers: {
                        'Authorization': 'tma ' + dataRaw
                    }
                })
                .then(response => {
                    setCounter(1);
                    setAmountsByType(response.data.amountsByType);
                    setAcceleratorsList(response.data.accelerators);
                    setIsAcceleratorsLoading(false);
                    setTonBalance(response.data.tonBalance);
                    function getAccelerateBalance(dataRaw) {
                        axios.get('/api/acceleratebalance', {
                            headers: {
                                'Authorization': 'tma ' + dataRaw
                            }
                        })
                            .then(response => {
                                setAccelerateBalance(response.data.accelerateBalance);
                                setAccelerateSpeed(response.data.accelerateSpeed);
                                showNotification(t('stakingForm.rentSuccess'));
                            })
                            .catch(error => {
                                console.error('Getting accelerate balance error: ', error);
                            })
                    }
                    getAccelerateBalance(dataRaw);
                })
                .catch(error => {
                    console.error('Rent accelerators error: ', error);
                    showError(error);
                    setIsAcceleratorsLoading(false);
                });
        } else {
            if (amountBuyedAccelerators === 5) {
                showError(t('stakingForm.maxFiveAccelerators'));
            } else {
                showError(t('stakingForm.insufficientFunds'));
            }
        }
    }

    const handleAccelerate = () => {
        setIsAcceleratorsLoading(true);
        setShowAccelerateModal(true);

        const dataRaw = retrieveRawInitData();
        axios.get('/api/accelerators', {
            headers: {
                'Authorization': 'tma ' + dataRaw
            }
        })
            .then(response => {
                if (response.data.acceleratorsConfig[0].acceleratorsStatus) {
                    setAmountsByType(response.data.amountsByType);
                    setAcceleratorsList(response.data.accelerators);
                }
                setAcceleratorsStatus(response.data.acceleratorsConfig[0].acceleratorsStatus)
                setAcceleratorsConfig(response.data.acceleratorsConfig);
                setIsAcceleratorsLoading(false);
            })
            .catch(error => {
                console.error('Get accelerators error: ', error);
                showError(error);
                setIsAcceleratorsLoading(false);
            });
    }

    const handleSetSelectedAccelerator = (idx) => {
        setCounter(1);
        setSelectedAccelerator(idx);
    }

    const closeAccelerateModal = () => {
        setShowAccelerateModal(false);
        setModalPage('accelerators');
        setSelectedAccelerator(0);
    }

    const handleDecrement = () => {
        if (counter > 1) {
            setCounter(counter - 1);
        }
    }

    const handleIncrement = () => {
        if (counter < 5 - amountsByType[selectedAccelerator]) {
            setCounter(counter + 1);
        } else {
            showError(t('stakingForm.maxFiveAccelerators'));
        }
    }

    const showStakingInfo = () => {
        if (acceleratorsStatus) {
            showNotification(t('stakingForm.offlineMiningInfo'), 10000);
        } else {
            showNotification(t('stakingForm.offlineMiningInfoAcBlocked'), 10000);
        }
    }

    const spinner = <span className="loading-inline-spinner"></span>;

    const renderAcceleratorsTable = () => {
        if (!acceleratorsList || acceleratorsList.length === 0) {
            return (
                <div className="empty-wrapper">
                    <div className="empty-message">{t('emptyList')}</div>
                </div>
            );
        }

        const now = new Date();

        const activeAccelerators = acceleratorsList.filter(acc => new Date(acc.stopDate) > now);

        if (activeAccelerators.length === 0) {
            return (
                <div className="empty-wrapper">
                    <div className="empty-message">{t('emptyList')}</div>
                </div>
            );
        }

        const acceleratorTypeInfo = [
            { title: 'CORE I-9', iconClass: 'accelerator-image-1', data: acceleratorsConfig[0] },
            { title: 'RTX 4090', iconClass: 'accelerator-image-2', data: acceleratorsConfig[1] },
            { title: 'A100 GPU', iconClass: 'accelerator-image-3', data: acceleratorsConfig[2] },
        ];

        const calculateRealtimeIncome = (stopDateStr, periodDays, incomePerDay) => {
            const stopDate = new Date(stopDateStr);
            const startDate = new Date(stopDate);
            startDate.setDate(stopDate.getDate() - periodDays);

            const secondsPassed = Math.min(
                (now - startDate) / 1000,
                periodDays * 24 * 3600
            );
            const incomePerSecond = incomePerDay / (24 * 3600);
            return incomePerSecond * secondsPassed;
        };

        const declOfNum = (number) => {
            const n = Math.abs(number) % 100;
            const n1 = n % 10;
            if (n > 10 && n < 20) return t('stakingForm.daysPlural');
            if (n1 > 1 && n1 < 5) return t('stakingForm.daysGenitiveSingular');
            if (n1 === 1) return t('stakingForm.daySingular');
            return t('stakingForm.daysPlural');
        };

        return (
            <div className="staking-accelerate-active-list">
                {activeAccelerators.map((acc) => {
                    const stopDateObj = new Date(acc.stopDate);
                    const daysLeft = Math.ceil((stopDateObj - now) / (1000 * 60 * 60 * 24));

                    const typeInfo = acceleratorTypeInfo[acc.type] || { title: t('stakingForm.unknownType'), iconClass: '', data: {} };
                    const { rentPeriod, profitPerDay } = typeInfo.data || { rentPeriod: 30, profitPerDay: 0 };

                    const realtimeIncome = calculateRealtimeIncome(acc.stopDate, +rentPeriod, +profitPerDay);

                    return (
                        <div key={acc.id} className="staking-accelerate-active-item">
                            <div className={`accelerator-icon ${typeInfo.iconClass}`}></div>
                            <div className="accelerator-details">
                                <div className="accelerator-title">{typeInfo.title}</div>
                                <div className="accelerator-stop-date">
                                    {t('stakingForm.daysLeft')}: {daysLeft} {declOfNum(daysLeft)}
                                </div>
                                <div className="accelerator-income">
                                    {t('stakingForm.totalMined')}: {realtimeIncome.toFixed(6)} TON
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    const renderAccelerateModal = () => {
        if (!showAccelerateModal
            || !Array.isArray(acceleratorsConfig)
            || !acceleratorsConfig[selectedAccelerator]
        ) return null;

        const rentCount = 5 - amountsByType[selectedAccelerator];
        const totalRentPrice = acceleratorsConfig[selectedAccelerator].rentPrice * counter;
        const totalPerDay = acceleratorsConfig[selectedAccelerator].profitPerDay * counter;
        const totalProfit = Math.ceil(acceleratorsConfig[selectedAccelerator].profitPerDay * acceleratorsConfig[selectedAccelerator].rentPeriod * counter);

        return (
            <div className="staking-accelerate-overlay" onClick={closeAccelerateModal}>
                <div className="staking-accelerate-container" onClick={(e) => e.stopPropagation()}>
                    <div className='staking-accelerate-menu-buttons'>
                        {acceleratorsStatus && (
                            <>
                                <button className={`staking-accelerate-menu-button ${modalPage === 'accelerators' ? 'btn-active' : ''}`} onClick={() => setModalPage('accelerators')}>{t('stakingForm.accelerators')}</button>
                                <button className={`staking-accelerate-menu-button ${modalPage === 'store' ? 'btn-active' : ''}`} onClick={() => setModalPage('store')}>{t('stakingForm.buy')}</button>
                            </>
                        )}
                    </div>
                    <button className="staking-accelerate-close" onClick={closeAccelerateModal}>×</button>
                    {!acceleratorsStatus ? (
                        <div className='acblocked-container'>
                            <div className='acbloccked-title'>{t('stakingForm.accelerators')}</div>
                            <div className='text-info-shadow'>
                                <div className="info-block friends-info-text">
                                    {t('acceleratorsBlocked.friendsInfo')}
                                </div>
                                <div className="info-block friends-subinfo-text">
                                    {t('acceleratorsBlocked.subFriendsInfo')}
                                </div>
                            </div>
                            <div className="stat-container">
                                <div className="stat-title">{t('acceleratorsBlocked.profitPerSecond')}</div>
                                <div className="stat-value">
                                    {isAcceleratorsLoading
                                        ? spinner
                                        : `${(starsMode ? (accelerateSpeed * course).toFixed(8) : accelerateSpeed.toFixed(8))} ${starsMode ? "STARS" : "TON"}`}
                                </div>
                            </div>

                            <div className="stat-container">
                                <div className="stat-title">{t('stakingForm.profitPerDay')}</div>
                                <div className="stat-value">
                                    {isAcceleratorsLoading
                                        ? spinner
                                        : `${starsMode ? (accelerateSpeed * 86400 * course).toFixed(4) : (accelerateSpeed * 86400).toFixed(4)} ${starsMode ? "STARS" : "TON"}`}
                                </div>
                            </div>

                            <div className="stat-container">
                                <div className="stat-title">{t('friends.friendAmount')}</div>
                                <div className="stat-value">
                                    {isAcceleratorsLoading
                                        ? spinner
                                        : `${friends.filter(friend => friend.status === 'active').length}`}
                                </div>
                            </div>

                            <button
                                className="btn-copy-link btn-copy-link--accelerators-blocked"
                                onClick={writeLinkInClipboard}
                            >
                                {t('friends.copyLink')}
                            </button>
                        </div>
                    ) : modalPage === 'store' ? (
                        <>
                            <div className="stacking-accelerate-accelerators-container">
                                <div className={`stacking-accelerate-accelerators-item ${selectedAccelerator === 0 ? 'active' : ''}`} onClick={() => handleSetSelectedAccelerator(0)}>
                                    <div className="stacking-accelerate-accelerators-item-title">CORE I-9</div>
                                    <div className="accelerator-image-1"></div>
                                    <div className="stacking-accelerate-accelerators-item-description">{(acceleratorsConfig[0].profitPerDay / 0.0864).toFixed(1)} mkT/s</div>
                                </div>
                                <div className={`stacking-accelerate-accelerators-item ${selectedAccelerator === 1 ? 'active' : ''}`} onClick={() => handleSetSelectedAccelerator(1)}>
                                    <div className="stacking-accelerate-accelerators-item-title">RTX 4090</div>
                                    <div className="accelerator-image-2"></div>
                                    <div className="stacking-accelerate-accelerators-item-description">{(acceleratorsConfig[1].profitPerDay / 0.0864).toFixed(1)} mkT/s</div>
                                </div>
                                <div className={`stacking-accelerate-accelerators-item ${selectedAccelerator === 2 ? 'active' : ''}`} onClick={() => handleSetSelectedAccelerator(2)}>
                                    <div className="stacking-accelerate-accelerators-item-title">A100 GPU</div>
                                    <div className="accelerator-image-3"></div>
                                    <div className="stacking-accelerate-accelerators-item-description">{(acceleratorsConfig[2].profitPerDay / 0.0864).toFixed(1)} mkT/s</div>
                                </div>
                            </div>
                            <div className="rent-period-container">
                                <div className="rent-period-title">{t('stakingForm.rentPeriod')}</div>
                                <div className="rent-period-description">
                                    {isAcceleratorsLoading ? spinner : `${acceleratorsConfig[selectedAccelerator].rentPeriod} ${t('stakingForm.daysPlural')}`}
                                </div>
                            </div>
                            <div className="per-day-container">
                                <div className="per-day-title">{t('stakingForm.profitPerDay')}</div>
                                <div className="per-day-description">
                                    {isAcceleratorsLoading ? spinner : `${totalPerDay} TON`}
                                </div>
                            </div>
                            <div className="total-profit-container">
                                <div className="total-profit-title">{t('stakingForm.totalProfit')}</div>
                                <div className="total-profit-description">
                                    {isAcceleratorsLoading ? spinner : `${totalProfit} TON`}
                                </div>
                            </div>
                            <div className="counter-title">{t('stakingForm.totalCount')}</div>
                            <div className="counter-container">
                                <div className="counter-button-minus" onClick={handleDecrement}>-</div>
                                <div className="counter-value">{isAcceleratorsLoading ? spinner : counter}</div>
                                <div className="counter-button-plus" onClick={handleIncrement}>+</div>
                            </div>
                            <div className="total-rent-price-container">
                                <div className="total-rent-price-title">{t('stakingForm.rentPrice')}</div>
                                <div className="total-rent-price-description">
                                    {isAcceleratorsLoading ? spinner : `${totalRentPrice} TON`}
                                </div>
                            </div>
                            <button
                                className={`staking-rent-accelerate-button ${(isAcceleratorsLoading || totalRentPrice > tonBalance || rentCount === 0) ? 'disabled-rent-button' : ''}`}
                                onClick={() => rentMiner(rentCount, selectedAccelerator, isAcceleratorsLoading, totalRentPrice, amountsByType[selectedAccelerator])}
                            >
                                {t('stakingForm.rentMiner')}
                            </button>
                        </>
                    ) : (
                        <>
                            {renderAcceleratorsTable()}
                        </>
                    )}
                </div>
            </div>
        )
    }

    if (!imagesLoaded) {
        return (
            <div className="staking-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <div className="loading-text">{t('stakingForm.loading')}</div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="staking-container">
                <div className={`content-wrapper-miner ${!isSubscriber ? 'blurred' : ''}`}>
                    <MinerAnimation images={cachedImages} />
                    <div className="staking-total-mined">{starsMode ? (accelerateBalance * course).toFixed(8) : accelerateBalance.toFixed(8)} {starsMode ? (
                        <img src="/assets/tg-star.svg" alt="STARS" className='star-switch-icon' />
                    ) : "TON"}</div>
                    <div className="accelearate-speed-info-container">
                        <div className="staking-hashrate">{t('stakingForm.speed')}: {starsMode ? (accelerateSpeed * course).toFixed(8) : accelerateSpeed.toFixed(8)} {starsMode ? "stars" : "T"}/s</div>
                        <button className="staking-info-button" onClick={showStakingInfo}>i</button>
                    </div>
                    <div className="staling-button-wrapper">
                        <button className={`staking-get-button ${accelerateBalance < 0.5 ? 'disabled-view' : ''}`} onClick={getUnfund}>{t('stakingForm.request')}</button>
                        <button className="staking-accelerate-button" onClick={handleAccelerate}>{t('stakingForm.accelerate')}</button>
                    </div>
                    {renderAccelerateModal()}
                </div>
                {!isSubscriber && (
                    <>
                        <div className="blur-overlay"></div>
                        <ChannelFollow setIsSubscriber={setIsSubscriber} />
                    </>
                )}
            </div>
        </>
    )
}
