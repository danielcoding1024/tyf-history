import React from 'react';
import { useLanguageStore } from '../store/languageStore';
import './LanguageSwitch.css';

export const LanguageSwitch: React.FC = () => {
  const { language, toggleLanguage } = useLanguageStore();

  return (
    <button
      type="button"
      className="language-switch"
      onClick={toggleLanguage}
      role="switch"
      aria-checked={language === 'EN'}
      aria-label={language === 'CN' ? '切换为英文' : 'Switch to Chinese'}
    >
      <span aria-hidden="true" className={language === 'CN' ? 'active' : ''}>中</span>
      <span aria-hidden="true" className={language === 'EN' ? 'active' : ''}>EN</span>
    </button>
  );
};
