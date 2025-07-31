import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { languages } from '../data';
import './LanguageSelector.css';

const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const [isOpen, setIsOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const selectLanguage = (language) => {
        setSelectedLanguage(language);
        i18n.changeLanguage(language.text)
        setIsOpen(false);
    };

    useEffect(() => {
        languages.forEach(lang => {
            const img = new Image();
            img.src = lang.image;
        });
    }, []);

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

    const currentLanguage = languages.find(language => language.text === selectedLanguage.text);

    return (
        <div className="language-selector" ref={dropdownRef}>
            <div className="selected-language" onClick={toggleDropdown}>
                <img src={currentLanguage.image} alt={currentLanguage.alt} />
                <span>{currentLanguage.text}</span>
            </div>

            {isOpen && (
                <div className="language-dropdown">
                    {languages.map((language) => (
                        <div
                         key={language.text}
                         className={`"language-option" ${selectedLanguage.text === language.text ? 'selected' : ''}`}
                         onClick={() => selectLanguage(language)}
                         >
                        <img src={language.image} alt={language.alt} className='language-option-image'/>
                        <span className='language-option-text'>{language.text}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default LanguageSelector;