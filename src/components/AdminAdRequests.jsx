import "./AdminAdRequests.css"
import axios from 'axios';
import { retrieveRawInitData } from '@telegram-apps/sdk';
import { useNotification } from './useNotification';
import { useEffect, useState } from "react";
import smallTonIcon from '../assets/small_ton.svg';

export default function AdminAdRequests({ adminAds, setAdminAds, adPackages, challenges, setChallenges }) {
    const { showError, showNotification } = useNotification();
    const [adPage, setAdPage] = useState('ads');
    const [mergedChallenges, setMergedChallenges] = useState([]);

    const handleMenuButtonClick = (transactionPage) => {
        setAdPage(transactionPage);
    }

    const copyLink = (link) => {
        navigator.clipboard.writeText(link)
        showNotification("Ссылка скопирована", 2000);
    }

    const calculateDeadline = (adPackageName, moderatedAt, adPackages) => {
        const pkg = adPackages.find(p => p.adPackageName === adPackageName);
        if (!pkg || !moderatedAt) return null;
        const startDate = new Date(moderatedAt);
        startDate.setDate(startDate.getDate() + pkg.adDays);
        return startDate.toLocaleString('ru-RU', { hour12: false });
    }

    const getStatusMeaning = (status) => {
        if (status === "moderation") {
            return "на модерации";
        }
        if (status === "active") {
            return "активен";
        }
        if (status === "deprecated") {
            return "показ закончен";
        }
        if (status === "deny") {
            return "отклонён";
        }
    }

    const handleDecisionAd = (id, decision) => {
        const dataRaw = retrieveRawInitData();
        const postData = {
            id: id,
            decision: decision
        };
        axios.post('/api/freetonadmin/ad', postData, {
            headers: {
                'Authorization': 'tma ' + dataRaw
            }
        })
            .then(response => {
                setAdminAds(response.data.advertisements);
                showNotification("Успешно выполнено")
            })
            .catch(error => {
                showError("Не удалось выполнить")
                console.error('Post ad decision error: ', error);
            })
    }

    const handleDeleteAd = (id) => {
        const dataRaw = retrieveRawInitData();
        const postData = {
            id: id
        };
        axios.post('/api/freetonadmin/delete/ad', postData, {
            headers: {
                'Authorization': 'tma ' + dataRaw
            }
        })
            .then(response => {
                setAdminAds(response.data.advertisements);
                showNotification("Успешно выполнено")
            })
            .catch(error => {
                showError("Не удалось выполнить")
                console.error('Post delete ad error: ', error);
            })
    }

    const handleDeleteChallenge = (id) => {
        const dataRaw = retrieveRawInitData();
        const postData = {
            id: id
        };
        axios.post('/api/freetonadmin/delete/challenge', postData, {
            headers: {
                'Authorization': 'tma ' + dataRaw
            }
        })
            .then(response => {
                setChallenges(response.data);
                showNotification("Успешно выполнено")
            })
            .catch(error => {
                showError("Не удалось выполнить")
                console.error('Post delete challenge error: ', error);
            })
    }

    useEffect(() => {
        if (!challenges) return;
        const mergedArray = challenges.allSurfingChallenges.concat(challenges.allTelegramChallenges);
        setMergedChallenges(mergedArray);
    }, [challenges]);

    const renderAdminChallenges = () => {
        if (!mergedChallenges || mergedChallenges.length === 0) {
            return (
                <div className="empty-wrapper">
                    <div className="empty-message">Список пуст</div>
                </div>
            );
        }
        return mergedChallenges.map((challenge, index) => {
            if (challenge.timeOfExecution !== undefined) {
                return (
                    <div className="challenge-moderation-container">
                        <div className="challenge-row sub" key={challenge.id || index}>
                            <div className="challenge-row-sub start">
                                <div className="challenge-item-text challenge-name">{challenge.name}</div>
                                <div className="challenge-item-text challenge-description">{challenge.description}</div>
                            </div>
                            <div className="challenge-row-sub end">
                                <div className="challenge-time-container">
                                    <div className="challenge-item-text">ВРЕМЯ: </div>
                                    <div className="challenge-item-text challenge-time-of-execution">{challenge.timeOfExecution} сек</div>
                                </div>
                                <span className="challenge-item-payment">
                                    <div className="challenge-item-text challege-price">{challenge.price.toFixed(7)}</div>
                                    <img src={smallTonIcon} alt="TON" />
                                </span>
                                <button className="challenge-surf-button">ПОСЕТИТЬ</button>
                            </div>
                        </div>
                        <div className="moderarion-info-block">
                            <div className="challenge-item-text">ИМЯ: {challenge.name}</div>
                            <div className="challenge-item-text">ОПИСАНИЕ: {challenge.description}</div>
                            <div className="challenge-item-text" onClick={() => copyLink(challenge.link)}>ССЫЛКА: {challenge.link}</div>
                            <div className="challenge-item-text">ПОВТОРЕНИЙ: {challenge.numberOfExecution}</div>
                            <div className="challenge-item-text ">ЦЕНА ЗА ВСЁ: {challenge.price * (5 / 3) * challenge.numberOfExecution} TON</div>
                        </div>
                        {challenge.status === "moderation" ? (
                            <div className='withdrawal-request-buttons'>
                                <button className='withdrawal-button yes' onClick={() => handleDecisionChallenge(challenge.id, 'done')}>ОДОБРИТЬ</button>
                                <button className='withdrawal-button no' onClick={() => handleDecisionChallenge(challenge.id, 'deny')}>ОТКЛОНИТЬ</button>
                            </div>
                        ) : challenge.status === "active" ? (
                            <>
                                <button className='withdrawal-button delete' onClick={() => handleDeleteChallenge(challenge.id)}>УДАЛИТЬ</button>
                            </>
                        ) : challenge.status === "deprecated" ? (
                            <div className="withdrawal-status">ЗАВЕРШЕНО</div>
                        ) : (
                            <div className="withdrawal-status">ОТКЛОНЕНО</div>
                        )}
                    </div>
                )
            } else {
                return (
                    <></>
                )
            }
        })
    }

    const renderAdminAds = () => {
        if (!adminAds || adminAds.length === 0) {
            return (
                <div className="empty-wrapper">
                    <div className="empty-message">Список пуст</div>
                </div>
            );
        }

        return adminAds.map((ad, index) => (
            <div className='admin-ad-container' key={ad.id || index}>
                <div className='demo-ad-container'>
                    <div className='demo-ad-info-container'>
                        <div className='demo-add-info'>
                            Пакет: {ad.adPackageName}
                        </div>
                        <div className='demo-add-info'>
                            Дата создания: {new Date(ad.createdAt).toLocaleString('ru-RU', { hour12: false })}
                        </div>
                        <div className='demo-add-info'>
                            Статус: {getStatusMeaning(ad.status)}
                        </div>
                        <div className='demo-add-info'>
                            Ссылка: {ad.adLink}
                        </div>
                        {ad.status === 'active' && (
                            <div className='demo-add-info'>
                                Показ закончится: {calculateDeadline(ad.adPackageName, ad.moderatedAt, adPackages)}
                            </div>
                        )}
                    </div>
                    <div className='advertising-container'>
                        <div className="add-container">
                            <div className='add-text'>
                                {ad.adText}
                            </div>
                            <div className="add-actions">
                                <button className="add-ad">Реклама</button>
                                <button className="add-button">{ad.adButtonText}</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='admin-ad-manage-container'>
                    {ad.status === 'moderation' ? (
                        <div className='withdrawal-request-buttons'>
                            <button className='withdrawal-button yes' onClick={() => handleDecisionAd(ad.id, 'active')}>ОДОБРИТЬ</button>
                            <button className='withdrawal-button no' onClick={() => handleDecisionAd(ad.id, 'deny')}>ОТКЛОНИТЬ</button>
                        </div>
                    ) : ad.status === 'deny' ? (
                        <div className="withdrawal-status">ОТКЛОНЕНО</div>
                    ) : ad.status === 'active' ? (
                        <div className='active-ad-container'>
                            <div className="withdrawal-status">ОДОБРЕНО</div>
                            <button className='withdrawal-button delete' onClick={() => handleDeleteAd(ad.id)}>УДАЛИТЬ</button>
                        </div>
                    ) : (
                        <div className='withdrawal-status'>ПОКАЗ ЗАКОНЧЕН</div>
                    )}
                </div>
            </div>
        ));
    }

    return (
        <div className="ad-challenges-container">
            <div className="ad-menu-button-container">
                <button className={`ad-menu-button ${adPage === 'ads' ? 'btn-active' : ''}`} onClick={() => handleMenuButtonClick("ads")}>РЕКЛАМА</button>
                <button className={`ad-menu-button ${adPage === 'challenges' ? 'btn-active' : ''}`} onClick={() => handleMenuButtonClick("challenges")}>ЗАДАНИЯ</button>
            </div>
            {adPage === "ads" ? (
                <div className="admin-ads-list">
                    {renderAdminAds()}
                </div>
            ) : (
                <div className="admin-ads-list">
                    {renderAdminChallenges()}
                </div>
            )}
        </div>
    )
}