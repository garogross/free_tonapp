import './Add.css';
import { openLink } from '@telegram-apps/sdk';

export default function Add({ setCurrentContent, setProfileSubMenu }) {
    const followToAdCabinet = () => {
        setCurrentContent("profile");
        setProfileSubMenu("advertising");
    };

    const handleAdClick = () => {
        if (openLink.isAvailable()) {
            openLink(adLink);
        }
    }

    return (
        <div className="add-container" onClick={handleAdClick}>
            <div className="add-text">
                Схемы, Темки, Абузы и многое другое! Подписывайся на мой канал о заработке
            </div>
            <div className="add-actions">
                <button className="add-ad"
                    onClick={(e) => {
                        e.stopPropagation();
                        followToAdCabinet();
                    }}>Реклама</button>
                <button className="add-button">ПОДПИСАТЬСЯ</button>
            </div>
        </div>
    );
}
