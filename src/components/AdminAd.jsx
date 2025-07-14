import { useState } from 'react';
import './AdminAd.css';
import AdminAdRequests from './AdminAdRequests';
import AdminAdPackages from './AdminAdPackages';

export default function AdminAd({ adminAds, setAdminAds, adPackages, setAdPackages }) {
    const [adPage, setAdPage] = useState('adrequests');

    const handleMenuButtonClick = (transactionPage) => {
        setAdPage(transactionPage);
    }

    return (
        <>
            <div className="transaction-menu-button-container">
                <button className={`transaction-menu-button ${adPage === 'adrequests' ? 'btn-active' : ''}`} onClick={() => handleMenuButtonClick("adrequests")}>ЗАЯВКИ</button>
                <button className={`transaction-menu-button ${adPage === 'adpackages' ? 'btn-active' : ''}`} onClick={() => handleMenuButtonClick("adpackages")}>ТАРИФЫ</button>
            </div>
            {adPage === "adrequests" ? (
                <AdminAdRequests adminAds={adminAds} setAdminAds={setAdminAds} adPackages={adPackages} />
            ) : (
                <AdminAdPackages adPackages={adPackages} setAdPackages={setAdPackages}/>
            )}
        </>
    )
}