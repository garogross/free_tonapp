import './AdminSettings.css'
import { useState } from "react";
import AdminSettingsCran from './AdminSettingsCran';
import AdminSettingsAccelerator from './AdminSettingsAccelerator';
import AdminSettingsChallenges from './AdminSettingsChallenges';

export default function AdminSettings( {initialNumbers, setInitialNumbers, setAcceleratorsConfig, acceleratorsConfig, challengesConfig, setChallengesConfig, course, setCourse } ) {
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
                <AdminSettingsCran initialNumbers={initialNumbers} setInitialNumbers={setInitialNumbers} course={course} setCourse={setCourse}/>
            ) : settingPage === "settingschallenges" ? (
                <AdminSettingsChallenges surfingConfigs={challengesConfig.surfingConfigs} setSurfingConfigs={setChallengesConfig} telegramChallengesConfig={challengesConfig.telegramChallengesConfig} setTelegramChalengesConfig={setChallengesConfig}/>
            ) : (
                <AdminSettingsAccelerator setAcceleratorsConfig={setAcceleratorsConfig} acceleratorsConfig={acceleratorsConfig}/>
            )}
        </>
    )
}