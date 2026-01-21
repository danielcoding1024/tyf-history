import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguageStore } from '../store/languageStore';
import { assetsConfig, getPdfPath } from '../config/assets.config';
import { LanguageSwitch } from '../components/LanguageSwitch';
import { BreathingAnimation } from '../components/animations/BreathingAnimation';
import { Typewriter } from '../components/animations/Typewriter';
import './Home.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguageStore();

  const handleReadBook = () => {
    const pdfPath = getPdfPath(language);
    window.open(pdfPath, '_blank');
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

  const titleLabels: Record<'CN' | 'EN', string> = {
    CN: '通远坊历史记忆',
    EN: 'Tong Yuan Fang History',
  };

  const timelineTitleLabels: Record<'CN' | 'EN', string> = {
    CN: '分类展示',
    EN: 'Category Display',
  };

  const timelineLabels: Record<'CN' | 'EN', string[]> = {
    CN: ['概述', '历史', '建筑', '口述'],
    EN: ['Overview', 'History', 'Architecture', 'Voices'],
  };

  const readBookLabels: Record<'CN' | 'EN', string> = {
    CN: '通远坊的历史研究报告',
    EN: 'Tongyuanfang Historical Research Report',
  };

  const timelineItems = ['overview', 'history', 'architecture', 'voices'];

  return (
    <div className="home-page">
      <div className="home-background">
        <div className="home-content">
          <div className="home-header">
            <img 
              src={assetsConfig.home.titleImage} 
              alt="Title" 
              className="home-title-image"
            />
          </div>

          <div className="home-language-switch-container">
            <LanguageSwitch />
          </div>

          <div className="home-main-image">
            <img src={assetsConfig.home.mainImage} alt="Main" />
          </div>

          <div 
            className="home-read-book" 
            onClick={handleReadBook}
            style={{ backgroundImage: `url(${assetsConfig.home.readBookBackground})` }}
          >
            <div className="read-book-content">
              <BreathingAnimation>
                <img
                  src={assetsConfig.icons.book}
                  alt="Book"
                  className="book-icon"
                />
              </BreathingAnimation>
              <span className="read-book-text">{readBookLabels[language]}</span>
            </div>
          </div>

          <div className="home-question-container">
            <button 
              className="home-question-button" 
              onClick={handleEnterChat}
              style={{ backgroundImage: `url(${assetsConfig.home.questionBackground})` }}
            >
              <Typewriter text={questionText} speed={100} loop={true} />
            </button>
            <img 
              src={assetsConfig.home.priestIcon} 
              alt="Priest" 
              className="home-question-icon"
              onClick={handleEnterChat}
            />
          </div>

          <div className="home-timeline">
            <h3 className="timeline-title">{timelineTitleLabels[language]}</h3>
            <div className="timeline-content">
              {timelineItems.map((category, index) => (
                <div 
                  key={category} 
                  className="timeline-item" 
                  onClick={() => handleNavClick(category)}
                >
                  <img 
                    src={assetsConfig.home.timelineIcons[index]} 
                    alt={timelineLabels[language][index]}
                    className="timeline-icon"
                  />
                  <span>{timelineLabels[language][index]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
