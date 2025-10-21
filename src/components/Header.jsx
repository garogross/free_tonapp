import { useState } from 'react';
import './Header.css';
import LanguageSelector from './LanguageSelector';
import BackButton from './BackButton';

export default function Header({ setCurrentContent, path, setStarsMode, starsMode }) {

  function handleStarsSwitch() {
    setStarsMode((prev) => !prev);
  }

  return (
    <header className="header">
      {path !== 'None' && <BackButton setCurrentContent={setCurrentContent} path={path} />}

      <div className="name-switch-wrapper" style={{ gridColumn: 1, textAlign: 'center' }}>
        <div className="star-switch-container" onClick={handleStarsSwitch}>
          <div className={`star-switch ${starsMode ? 'active' : ''}`}>
            <div className="star-switch-thumb">
              <img
                src="/assets/tg-star.svg"
                alt="stars"
                className="star-switch-icon"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="logo" style={{ gridColumn: 2 }}>
        <img src="/assets/logo.svg" alt="FreeTon" />
      </div>
      <LanguageSelector />
    </header>
  );
}
