import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguageStore } from '../store/languageStore';
import { assetsConfig, getReportPdfPath } from '../config/assets.config';
import { siteCopy } from '../config/detail-content.config';
import { LanguageSwitch } from '../components/LanguageSwitch';
import { BreathingAnimation } from '../components/animations/BreathingAnimation';
import { Typewriter } from '../components/animations/Typewriter';
import './Home.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguageStore();

  const handleReadReport = () => {
    window.open(getReportPdfPath(language), '_blank', 'noopener,noreferrer');
  };

  const handleEnterChat = () => {
    navigate('/chat');
  };

  const handleNavClick = (category: string) => {
    navigate(`/detail/${category}`);
  };

  const questionText = language === 'CN' 
    ? '你有什么想问我的吗？' 
    : 'Do you have any questions for me?';

  const timelineTitleLabels: Record<'CN' | 'EN', string> = {
    CN: '分类展示',
    EN: 'Category Display',
  };

  const timelineLabels: Record<'CN' | 'EN', string[]> = {
    CN: ['概述', '历史', '建筑', '口述'],
    EN: ['Overview', 'History', 'Architecture', 'Voices'],
  };

  const timelineItems = ['overview', 'history', 'architecture', 'voices'];

  return (
    <div className="home-page">
      <div className="home-background">
        <div className="home-content">
          <div className="home-header">
            <img 
              src={assetsConfig.home.titleImage} 
              alt={language === 'CN' ? '通远坊数字历史档案馆' : 'Tongyuan Ward Digital History Archive'}
              className="home-title-image"
            />
          </div>

          <div className="home-language-switch-container">
            <LanguageSwitch />
          </div>

          <div className="home-main-image">
            <img
              src={assetsConfig.home.mainImage}
              alt={language === 'CN' ? '通远坊历史建筑群' : 'Historic architecture of Tongyuan Ward'}
            />
          </div>

          <button
            type="button"
            className="home-read-book" 
            onClick={handleReadReport}
            style={{ backgroundImage: `url(${assetsConfig.home.readBookBackground})` }}
            aria-label={siteCopy[language].reportTitle}
          >
            <div className="read-book-content">
              <BreathingAnimation>
                <img
                  src={assetsConfig.icons.book}
                  alt=""
                  aria-hidden="true"
                  className="book-icon"
                />
              </BreathingAnimation>
              <span className="read-book-copy">
                <span className="read-book-kicker">{language === 'CN' ? '研究报告' : 'RESEARCH REPORT'}</span>
                <span className="read-book-text">{siteCopy[language].reportTitle}</span>
              </span>
              <span className="read-book-arrow" aria-hidden="true">↗</span>
            </div>
          </button>

          <div className="home-question-container">
            <button 
              type="button"
              className="home-question-button" 
              onClick={handleEnterChat}
              style={{ backgroundImage: `url(${assetsConfig.home.questionBackground})` }}
              aria-label={questionText}
            >
              <span className="home-question-copy">
                <span className="home-question-kicker">{language === 'CN' ? '数字历史向导' : 'DIGITAL HISTORY GUIDE'}</span>
                <Typewriter key={questionText} text={questionText} speed={100} loop={true} />
              </span>
              <img
                src={assetsConfig.home.priestIcon}
                alt=""
                aria-hidden="true"
                className="home-question-icon"
              />
            </button>
          </div>

          <div className="home-timeline">
            <h3 className="timeline-title">{timelineTitleLabels[language]}</h3>
            <div className="timeline-content">
              {timelineItems.map((category, index) => (
                <button
                  type="button"
                  key={category} 
                  className="timeline-item" 
                  onClick={() => handleNavClick(category)}
                >
                  <img 
                    src={assetsConfig.home.timelineIcons[index]} 
                    alt=""
                    aria-hidden="true"
                    className="timeline-icon"
                  />
                  <span>{timelineLabels[language][index]}</span>
                  <span className="timeline-item-arrow" aria-hidden="true">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
