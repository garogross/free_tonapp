import React, { useState, useEffect } from 'react';
import './Add.css';
import { openLink } from '@telegram-apps/sdk';
import { useTranslation } from 'react-i18next';

export default function Add({ setCurrentContent, setProfileSubMenu, activeAds }) {
    const { t } = useTranslation();
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
                <div className="add-text no-add">{t('adOfAd')}</div>
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
                    {t('adButtonText')}
                </button>
                <button
                    className="add-button"
                >
                    {currentAd.adButtonText || t('adDefaultButton')}
                </button>
            </div>
        </div>
    );
}
