import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguageStore } from '../store/languageStore';
import { assetsConfig } from '../config/assets.config';
import { LanguageSwitch } from '../components/LanguageSwitch';
import './Cover.css';

export const Cover: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguageStore();

  const handleGetStarted = () => {
    navigate('/home');
  };

  const titleLabels: Record<'CN' | 'EN', { line1: string; line2: string }> = {
    CN: {
      line1: '数字历史',
      line2: '教堂博物馆',
    },
    EN: {
      line1: 'Digital History',
      line2: 'Church Museum',
    },
  };

  const descriptionLabels: Record<'CN' | 'EN', { line1: string; line2: string }> = {
    CN: {
      line1: '数字化身动画',
      line2: '教堂历史的数字展示',
    },
    EN: {
      line1: 'Digital avatar animations',
      line2: 'A digital showcase of the church\'s history',
    },
  };

  const buttonLabels: Record<'CN' | 'EN', string> = {
    CN: '开始体验',
    EN: 'Get Started',
  };

  return (
    <div className="cover-page">
      <div className="cover-background">
        <div className="cover-content">
          <div className="cover-header">
            <img 
              src={assetsConfig.cover.titleImage} 
              alt="Title" 
              className="cover-title-image"
            />
          </div>

          <div className="cover-main">
            <LanguageSwitch />
            <div className="cover-building-container">
              <img
                src={assetsConfig.cover.buildingGif}
                alt="Building"
                className="cover-building"
              />
            </div>
            <div className="cover-description">
              <p className="description-line1">{descriptionLabels[language].line1}</p>
              <p className="description-line2">{descriptionLabels[language].line2}</p>
            </div>
          </div>

          <button 
            className="cover-button" 
            onClick={handleGetStarted}
            style={{
              backgroundImage: `url(${assetsConfig.cover.buttonImage})`,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          />
        </div>
      </div>
    </div>
  );
};
