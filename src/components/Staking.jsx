import { useState, useEffect } from 'react';
import './Staking.css'
import miner from '../assets/miner.png'
import miner2 from '../assets/miner2.png'
import { accelerators } from '../data'
import { retrieveRawInitData } from '@telegram-apps/sdk'
import axios from 'axios';

const globalMinerImageCache = window.__minerImageCache || (window.__minerImageCache = { loaded: false, images: [] });

export default function Staking( {setTonBalance, tonBalance, accelerateBalance, accelerateSpeed, setAccelerateBalance, setAccelerateSpeed} ) {
    const [currentImage, setCurrentImage] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [counter, setCounter] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(globalMinerImageCache.loaded);
    const [cachedImages, setCachedImages] = useState(globalMinerImageCache.images);
    const [selectedAccelerator, setSelectedAccelerator] = useState(0);
    const [showAccelerateModal, setShowAccelerateModal] = useState(false);
    const [amountsByType, setAmountsByType] = useState([0, 0, 0]);
    const [isAcceleratorsLoading, setIsAcceleratorsLoading] = useState(false);
    const imageUrls = [miner, miner2];

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

    useEffect(() => {
        if (!imagesLoaded || cachedImages.length === 0) return;
    
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentImage(prev => (prev + 1) % cachedImages.length);
                setIsAnimating(false);
            }, 250);
        }, 1000);
    
        return () => clearInterval(interval);
    }, [imagesLoaded, cachedImages]);

    const getUnfund = () => {
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
            alert(error);
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
            alert(error);
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
        }
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
        <div className="staking-container">
            <img 
                src={cachedImages[currentImage]} 
                alt="Miner animation" 
                className={`miner-gif ${isAnimating ? 'miner-transition' : ''}`}
            />
            <div className="staking-total-mined">{accelerateBalance.toFixed(8)} TON</div>
            <div className="staking-hashrate">СКОРОСТЬ: {accelerateSpeed.toFixed(8)} T/s</div>
            <button className={`staking-get-button ${accelerateBalance<5 ? 'disabled' : ''}`} disabled={accelerateBalance<5} onClick={() => getUnfund()}>ЗАПРОСИТЬ</button>
            <button className="staking-accelerate-button" onClick={handleAccelerate}>УСКОРИТЕЛЬ</button>
            {renderAccelerateModal()}
        </div>
    )
}