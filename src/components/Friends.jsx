import './Friends.css'
import tonIcon from '../assets/ton.svg'
import { useState, useEffect } from 'react';
import { shareMessage, ShareMessageError, retrieveLaunchParams} from '@telegram-apps/sdk';
import { useNotification } from './useNotification'

export default function Friends( { friends } ) {
    const { showError, showNotification } = useNotification();
    const [totalPrize, setTotalPrize] = useState(0);
    const initData = retrieveLaunchParams();
    const userId = initData.tgWebAppData.user.id;

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
    const messageId = getQueryParam('message_id');

    const handleInvite = async () => {
        if (shareMessage.isAvailable()) {
            try {
                await shareMessage(messageId);
            } catch (error) {
                if (error instanceof ShareMessageError && error.message === 'USER_DECLINED') {
                    return;
                  }
                console.log(error);
                showError("Откройте приложение через команду /start");
            }
        }
    };

    const writeLinkInClipboard = () => {
        navigator.clipboard.writeText("https://t.me/parserGigaChatbot_bot?start="+userId);
        showNotification("Ссылка скопирована", 1000);
    };

    useEffect(() => {
        const total = friends.reduce((acc, friend) => acc + friend.prize, 0);
        setTotalPrize(total);
      }, [friends]);

    const getFriendFullName = (firstName, lastName, index) => {
        if (firstName === "" && lastName === "") return "Друг #" + index;
        if (!firstName) {
            firstName = "";
        }
        if (!lastName) {
            lastName = "";
        }
        return firstName+" "+lastName;
    }

    const renderFriendsTable = () => {
        if (!friends || friends.length === 0) {
            return (
                <div className="empty-wrapper">
                    <div className="empty-message">Список пуст</div>
                </div>
            );
        }
        
        return friends.map((friend, index) => (
            <div className="transaction-row" key={friend.id || index}>
                <div className="transaction-cell">{getFriendFullName(friend.firstName, friend.lastName, index)}</div>
                <div className="transaction-cell">Доход: {friend.prize.toFixed(6)}</div>
            </div>
        ));
    }

    return (
        <div className="friends-container">
            <div className="friends-title">Реферальная система</div>
            <div className="friends-description">Приглашайте друзей и получайте 50% от их заработка на кране и 15% от заданий</div>
            <button className="friends-button" onClick={handleInvite}>ПРИГЛАСИТЬ</button>
            <button className="friends-button-copy" onClick={writeLinkInClipboard}>СКОПИРОВАТЬ ССЫЛКУ</button>
            <div className="friends-list-title">Список ваших друзей</div>
            <div className="friends-balance-container">
                <div className="friends-balance-title">Общий доход:</div>
                <div className="friends-balance-value">{totalPrize.toFixed(6)}</div>
                <div className="friends-balance-icon">
                    <img src={tonIcon} alt="TON" />
                </div>
            </div>
            <div className="friends-list">
                {renderFriendsTable()}
            </div>
        </div>
    )
}