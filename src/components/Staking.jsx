import { useState, useEffect } from 'react';
import './Staking.css'
import miner from '../assets/miner.png'
import miner2 from '../assets/miner2.png'
import { accelerators } from '../data'
import { retrieveRawInitData } from '@telegram-apps/sdk'
import MinerAnimation from './MinerAnimation';
import axios from 'axios';
import { useNotification } from './useNotification';
import tonIcon from '../assets/ton.svg';

const globalMinerImageCache = window.__minerImageCache || (window.__minerImageCache = { loaded: false, images: [] });

export default function Staking( {setTonBalance, tonBalance, accelerateBalance, accelerateSpeed, setAccelerateBalance, setAccelerateSpeed} ) {
    const [counter, setCounter] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(globalMinerImageCache.loaded);
    const [cachedImages, setCachedImages] = useState(globalMinerImageCache.images);
    const [selectedAccelerator, setSelectedAccelerator] = useState(0);
    const [showAccelerateModal, setShowAccelerateModal] = useState(false);
    const [amountsByType, setAmountsByType] = useState([0, 0, 0]);
    const [isAcceleratorsLoading, setIsAcceleratorsLoading] = useState(false);
    const imageUrls = [miner, miner2];
    const { showError, showNotification } = useNotification();

    useEffect(() => {
        if (globalMinerImageCache.loaded) {
            setCachedImages(globalMinerImageCache.images);
            setImagesLoaded(true);
            return;
        }

        const preloadImages = async () => {
            try {
                const cachedImagePromises = imageUrls.map(async (src) => {
                    const response = await fetch(src);
                    const blob = await response.blob();
                    return URL.createObjectURL(blob);
                });

                const cachedImageUrls = await Promise.all(cachedImagePromises);
                setCachedImages(cachedImageUrls);
                setImagesLoaded(true);

                globalMinerImageCache.loaded = true;
                globalMinerImageCache.images = cachedImageUrls;
            } catch (error) {
                console.error('Ошибка загрузки изображений:', error);
                setCachedImages(imageUrls);
                setImagesLoaded(true);

                globalMinerImageCache.loaded = true;
                globalMinerImageCache.images = imageUrls;
            }
        };

        preloadImages();

        return () => {};
    }, []);

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
            showError("Запросить вывод можно от 0.5 TON");
        }
    }  

    const rentMiner = (rentCount, selectedAccelerator) => {
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
            setCounter(response.data.amountsByType[selectedAccelerator])
            setAmountsByType(response.data.amountsByType);
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
            setCounter(response.data.amountsByType[selectedAccelerator]);
            setAmountsByType(response.data.amountsByType);
            setIsAcceleratorsLoading(false);
        })
        .catch(error => {
            console.error('Get accelerators error: ', error);
            showError(error);
            setIsAcceleratorsLoading(false);
        });
    }

    const handleSetSelectedAccelerator = (idx) => {
        setCounter(amountsByType[idx]);
        setSelectedAccelerator(idx);
    }

    const closeAccelerateModal = () => {
        setShowAccelerateModal(false);
        setCounter(amountsByType[selectedAccelerator]);
    }

    const handleDecrement = () => {
        if (counter > amountsByType[selectedAccelerator]) {
            setCounter(counter - 1);
        }
    }

    const handleIncrement = () => {
        if (counter < 5) {
            setCounter(counter + 1);
        } else {
            showError("Максимум 5 ускорителей каждого типа")
        }
    }

    const showStakingInfo = () => {
        showNotification("Для пользователей без подключённых ускорителей оффлайн-майнинг доступен только 12 часов — чтобы он не останавливался, заходите в приложение не реже чем раз в 12 часов.", 10000);
    }

    const spinner = <span className="loading-inline-spinner"></span>;

    const renderAccelerateModal = () => {
        if (!showAccelerateModal) return null;

        const rentCount = Math.max(0, counter - amountsByType[selectedAccelerator]);
        const totalRentPrice = accelerators[selectedAccelerator]['rentCost'] * rentCount;
        const totalPerDay = accelerators[selectedAccelerator]['incomePerDay'] * counter;
        const totalProfit = accelerators[selectedAccelerator]['totalIncome'] * counter;

        return (
            <div className="staking-accelerate-overlay" onClick={closeAccelerateModal}>
                <div className="staking-accelerate-container" onClick={(e) => e.stopPropagation()}>
                    <div className="staking-accelerate-title">УСКОРИТЕЛЬ</div>
                    <button className="staking-accelerate-close" onClick={closeAccelerateModal}>×</button>
                    <div className="stacking-accelerate-accelerators-container">
                        <div className={`stacking-accelerate-accelerators-item ${selectedAccelerator === 0 ? 'active' : ''}`} onClick={() => handleSetSelectedAccelerator(0)}>
                            <div className="stacking-accelerate-accelerators-item-title">CORE I-9</div>
                            <div className="accelerator-image-1"></div>
                            <div className="stacking-accelerate-accelerators-item-description">2.7 mkT/s</div>
                        </div>
                        <div className={`stacking-accelerate-accelerators-item ${selectedAccelerator === 1 ? 'active' : ''}`} onClick={() => handleSetSelectedAccelerator(1)}>
                            <div className="stacking-accelerate-accelerators-item-title">RTX 4090</div>
                            <div className="accelerator-image-2"></div>
                            <div className="stacking-accelerate-accelerators-item-description">5.7 mkT/s</div>
                        </div>
                        <div className={`stacking-accelerate-accelerators-item ${selectedAccelerator === 2 ? 'active' : ''}`} onClick={() => handleSetSelectedAccelerator(2)}>
                            <div className="stacking-accelerate-accelerators-item-title">A100 GPU</div>
                            <div className="accelerator-image-3"></div>
                            <div className="stacking-accelerate-accelerators-item-description">11.7 mkT/s</div>
                        </div>
                    </div>
                    <div className="rent-period-container">
                        <div className="rent-period-title">Период аренды</div>
                        <div className="rent-period-description">
                            {isAcceleratorsLoading ? spinner : accelerators[selectedAccelerator]['period']} дней
                        </div>
                    </div>
                    <div className="per-day-container">
                        <div className="per-day-title">Прибыль/день</div>
                        <div className="per-day-description">
                            {isAcceleratorsLoading ? spinner : totalPerDay} TON
                        </div>
                    </div>
                    <div className="total-profit-container">
                        <div className="total-profit-title">Общая прибыль</div>
                        <div className="total-profit-description">
                            {isAcceleratorsLoading ? spinner : totalProfit} TON
                        </div>
                    </div>
                    <div className="counter-title">Общее количество</div>
                    <div className="counter-container">
                        <div className="counter-button-minus" onClick={handleDecrement}>-</div>
                        <div className="counter-value">{isAcceleratorsLoading ? spinner : counter}</div>
                        <div className="counter-button-plus" onClick={handleIncrement}>+</div>
                    </div>
                    <div className="total-rent-price-container">
                        <div className="total-rent-price-title">Цена аренды</div>
                        <div className="total-rent-price-description">
                            {isAcceleratorsLoading ? spinner : totalRentPrice} TON
                        </div>
                    </div>
                    <button className={`staking-rent-accelerate-button ${(isAcceleratorsLoading || totalRentPrice > tonBalance || rentCount == 0) ? 'disabled' : ''}`} disabled={(isAcceleratorsLoading || totalRentPrice > tonBalance || rentCount == 0)} onClick={() => rentMiner(rentCount, selectedAccelerator)}>
                        АРЕНДОВАТЬ МАЙНЕР
                    </button>
                </div>
            </div>
        )
    }

    if (!imagesLoaded) {
        return (
            <div className="staking-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <div className="loading-text">Загрузка...</div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="staking-balance-container">
                <div className="staking-balance-title">Баланс</div>
                <div className="staking-value-container">
                    <div className="staking-balance-value">{tonBalance.toFixed(6)}</div>
                    <div className="staking-balance-icon">
                        <img src={tonIcon} alt="TON" />
                    </div>
                </div>
            </div>
            <div className="staking-container">
                <MinerAnimation images={cachedImages} />
                <div className="staking-total-mined">{accelerateBalance.toFixed(8)} TON</div>
                <div className="accelearate-speed-info-container">
                    <div className="staking-hashrate">СКОРОСТЬ: {accelerateSpeed.toFixed(8)} T/s</div>
                    <button className="staking-info-button" onClick={showStakingInfo}>i</button>
                </div>
                <div className="staling-button-wrapper">
                    <button className={`staking-get-button ${accelerateBalance<0.5 ? 'disabled-view' : ''}`} onClick={() => getUnfund()}>ЗАПРОСИТЬ</button>
                    <button className="staking-accelerate-button" onClick={handleAccelerate}>УСКОРИТЕЛЬ</button>
                </div>
                {renderAccelerateModal()}
            </div>
        </>
    )
}
