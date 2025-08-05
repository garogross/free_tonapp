import React, { useState, useEffect } from 'react';
import './Add.css';
import { openLink } from '@telegram-apps/sdk';
import { useTranslation } from 'react-i18next';

export default function Add({ setCurrentContent, setProfileSubMenu, activeAds }) {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const AD_SCRIPT_ID = "ad_script_1234";

    useEffect(() => {
        if (!document.getElementById(AD_SCRIPT_ID)) {
            const script = document.createElement('script');
            script.id = AD_SCRIPT_ID;
            script.src = 'https://vemtoutcheeg.com/400/9673680';
            script.async = true;
            script.onload = () => console.log('Ad script loaded');
            script.onerror = () => console.error('Ad script error');
            (document.body || document.documentElement).appendChild(script);
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
          const iframe = document.querySelector('iframe');
          if (iframe) {
            iframe.style.setProperty('inset', '68vh auto auto auto', 'important');
          }
        }, 300);
      
        return () => clearInterval(interval);
      }, []);
      

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