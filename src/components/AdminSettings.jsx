import './AdminSettings.css'
import { useState } from "react";
import AdminSettingsCran from './AdminSettingsCran';

export default function AdminSettings( {initialNumbers} ) {
    const [settingPage, setSettingPage] = useState('settingscran');

    const handleMenuButtonClick = (settingPage) => {
        setSettingPage(settingPage);
    }

    return (
        <>
            <div className="transaction-menu-button-container">
                <button className={`settings-menu-button ${settingPage === 'settingscran' ? 'btn-active' : ''}`} onClick={() => handleMenuButtonClick("settingscran")}>КРАН</button>
                <button className={`settings-menu-button ${settingPage === 'settingschallenges' ? 'btn-active' : ''}`} onClick={() => handleMenuButtonClick("settingschallenges")}>ЗАДАНИЯ</button>
                <button className={`settings-menu-button ${settingPage === 'settingsstaking' ? 'btn-active' : ''}`} onClick={() => handleMenuButtonClick("settingsstaking")}>УСКОРИТЕЛИ</button>
            </div>
            {settingPage === "settingscran" ? (
                <AdminSettingsCran initialNumbers={initialNumbers}/>
            ) : settingPage === "settingschallenges" ? (
                <></>
            ) : (
                <></>
            )}
        </>
    )
}