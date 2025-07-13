import './AdminAd.css';
import axios from 'axios';
import { retrieveRawInitData } from '@telegram-apps/sdk';
import { useNotification } from './useNotification';

export default function AdminAd({ adminAds, setAdminAds, adPackages }) {
    const { showError, showNotification } = useNotification();

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

    const handleDecision = (id, decision) => {
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

    const handleDelete = (id) => {
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
                            <button className='withdrawal-button yes' onClick={() => handleDecision(ad.id, 'active')}>ОДОБРИТЬ</button>
                            <button className='withdrawal-button no' onClick={() => handleDecision(ad.id, 'deny')}>ОТКЛОНИТЬ</button>
                        </div>
                    ) : ad.status === 'deny' ? (
                        <div className="withdrawal-status">ОТКЛОНЕНО</div>
                    ) : ad.status === 'active' ? (
                        <div className='active-ad-container'>
                            <div className="withdrawal-status">ОДОБРЕНО</div>
                            <button className='withdrawal-button delete' onClick={() => handleDelete(ad.id)}>УДАЛИТЬ</button>
                        </div>
                    ) : (
                        <div className='withdrawal-status'>ПОКАЗ ЗАКОНЧЕН</div>
                    )}
                </div>
            </div>
        ));
    }

    return (
        <>
            <div className="admin-ads-list">
                {renderAdminAds()}
            </div>
        </>
    )
}