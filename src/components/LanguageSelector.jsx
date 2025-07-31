import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { languages } from '../data';
import './LanguageSelector.css';

const blobUrlCache = {};

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [blobUrls, setBlobUrls] = useState({});
  const dropdownRef = useRef(null);

  const loadImageAsBlobUrl = async (url) => {
    if (blobUrlCache[url]) {
      return blobUrlCache[url];
    }
    const response = await fetch(url, { cache: "force-cache" });
    if (!response.ok) {
      throw new Error(`Failed to load image: ${url}`);
    }
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    blobUrlCache[url] = blobUrl;
    return blobUrl;
  };

  useEffect(() => {
    let cancelled = false;
    async function preloadAll() {
      const entries = await Promise.all(
        languages.map(async (lang) => {
          try {
            const blobUrl = await loadImageAsBlobUrl(lang.image);
            return [lang.text, blobUrl];
          } catch (err) {
            console.error(err);
            return [lang.text, lang.image];
          }
        })
      );
      if (!cancelled) {
        const newBlobUrls = Object.fromEntries(entries);
        setBlobUrls(newBlobUrls);
      }
    }
    preloadAll();

    return () => {
      cancelled = true;
      Object.values(blobUrlCache).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectLanguage = (language) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language.text);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentLanguage = languages.find(
    (language) => language.text === selectedLanguage.text
  );

  const currentBlobUrl = blobUrls[currentLanguage?.text] || currentLanguage?.image;

  return (
    <div className="language-selector" ref={dropdownRef}>
      <div className="selected-language" onClick={toggleDropdown}>
        <img src={currentBlobUrl} alt={currentLanguage?.alt} />
        <span>{currentLanguage?.text}</span>
      </div>

      {isOpen && (
        <div className="language-dropdown">
          {languages.map((language) => {
            const blobUrl = blobUrls[language.text] || language.image;
            return (
              <div
                key={language.text}
                className={`language-option ${
                  selectedLanguage.text === language.text ? 'selected' : ''
                }`}
                onClick={() => selectLanguage(language)}
              >
                <img
                  src={blobUrl}
                  alt={language.alt}
                  className="language-option-image"
                />
                <span className="language-option-text">{language.text}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
