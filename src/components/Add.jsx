import React, { useState, useEffect } from 'react';
import './Add.css';
import { openLink } from '@telegram-apps/sdk';

export default function Add({ setCurrentContent, setProfileSubMenu, activeAds }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!activeAds || activeAds.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % activeAds.length);
        }, 7000);

        return () => clearInterval(interval);
    }, [activeAds]);

    const followToAdCabinet = () => {
        setCurrentContent("profile");
        setProfileSubMenu("advertising");
    };

    const handleAdClick = () => {
        if (!activeAds || activeAds.length === 0) return;

        const adLink = activeAds[currentIndex].adLink;
        if (openLink.isAvailable()) {
            openLink(adLink);
        }
    };

    if (!activeAds || activeAds.length === 0) {
        return (
            <div className="add-container no-add" onClick={followToAdCabinet}>
                <div className="add-text no-add">ТУТ МОЖЕТ БЫТЬ ВАША РЕКЛАМА</div>
            </div>
        );
    }

    const currentAd = activeAds[currentIndex];

    return (
        <div className="add-container" onClick={handleAdClick}>
            <div className="add-text">
                {currentAd.adText}
            </div>
            <div className="add-actions">
                <button
                    className="add-ad"
                    onClick={(e) => {
                        e.stopPropagation();
                        followToAdCabinet();
                    }}
                >
                    Реклама
                </button>
                <button
                    className="add-button"
                >
                    {currentAd.adButtonText || 'ПЕРЕЙТИ'}
                </button>
            </div>
        </div>
    );
}
