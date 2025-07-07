import './Add.css';

export default function Add({ gridRow, setCurrentContent, setProfileSubMenu }) {
    const followToAdCabinet = () => {
        setCurrentContent("profile");
        setProfileSubMenu("advertising");
    };

    return (
        <div className="add-container">
            <div className="add-text">
                Схемы, Темки, Абузы и многое другое!<br />
                Подписывайся на мой канал о заработке
            </div>
            <div className="add-actions">
                <button className="add-ad" onClick={followToAdCabinet}>Реклама</button>
                <button className="add-button">ПОДПИСАТЬСЯ</button>
            </div>
        </div>
    );
}
