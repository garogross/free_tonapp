import './Friends.css'
import { useState, useEffect } from 'react';
import { shareMessage, ShareMessageError, retrieveLaunchParams } from '@telegram-apps/sdk';
import { useNotification } from './useNotification'
import { useTranslation } from 'react-i18next';

export default function Friends({ friends, starsMode, course }) {
    const { showError, showNotification } = useNotification();
    const [totalPrize, setTotalPrize] = useState(0);
    const initData = retrieveLaunchParams();
    const userId = initData.tgWebAppData.user.id;
    const { t } = useTranslation();


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
                showError(t('friends.openAppViaStart'));
            }
        }
    };

    const writeLinkInClipboard = () => {
        navigator.clipboard.writeText("https://t.me/Freetoon_bot?start=" + userId);
        showNotification(t('friends.linkCopied'), 1000);
    };


    useEffect(() => {
        const total = friends.reduce((acc, friend) => acc + friend.prize, 0);
        setTotalPrize(total);
    }, [friends]);


    const getFriendFullName = (firstName, lastName, index) => {
        if (firstName === "" && lastName === "") return t('friends.friendNumber', { number: index + 1 });
        if (!firstName) {
            firstName = "";
        }
        if (!lastName) {
            lastName = "";
        }
        return firstName + " " + lastName;
    }


    const renderFriendsTable = () => {
        if (!friends || friends.length === 0) {
            return (
                <div className="empty-wrapper">
                    <div className="empty-message">{t('emptyList')}</div>
                </div>
            );
        }

        return friends.map((friend, index) => (
            <div className="transaction-row" key={friend.id || index}>
                <div className="transaction-cell">{getFriendFullName(friend.firstName, friend.lastName, index)}</div>
                <div className="transaction-cell">{t('friends.income')}: {starsMode ? (friend.prize * course).toFixed(6) : friend.prize.toFixed(6)}</div>
            </div>
        ));
    }

    return (
        <div className="friends-container">
            <div className="friends-title">{t('friends.referralSystem')}</div>
            <div className="friends-description">{t('friends.inviteDescription')}</div>
            <button className="friends-button" onClick={handleInvite}>{t('friends.invite')}</button>
            <button className="friends-button-copy" onClick={writeLinkInClipboard}>{t('friends.copyLink')}</button>
            <div className="friends-list-title">{t('friends.listOfFriends')}</div>
            <div className="friends-balance-container">
                <div className="friends-balance-title">{t('friends.totalIncome')}:</div>
                <div className="friends-balance-value">{starsMode ? (totalPrize * course).toFixed(6) : totalPrize.toFixed(6)}</div>
                <div className="friends-balance-icon">
                    {starsMode ? (
                        <img src="/assets/star.svg" alt="stars" className='star-switch-icon'/>
                    ): (
                        <img src = "/assets/ton.svg" alt = "TON" />
                    )}
                </div>
            </div>
            <div className="friends-list">
                {renderFriendsTable()}
            </div>
        </div>
    )
}
