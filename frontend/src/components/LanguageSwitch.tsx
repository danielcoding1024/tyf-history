import React from 'react';
import { useLanguageStore } from '../store/languageStore';
import './LanguageSwitch.css';

export const LanguageSwitch: React.FC = () => {
  const { language, toggleLanguage } = useLanguageStore();

  return (
    <button className="language-switch" onClick={toggleLanguage}>
      <span className={language === 'CN' ? 'active' : ''}>中</span>
      <span className={language === 'EN' ? 'active' : ''}>EN</span>
    </button>
  );
};
