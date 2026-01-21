import React, { useState, useEffect } from 'react';
import './Typewriter.css';

interface TypewriterProps {
  text: string;
  speed?: number;
  loop?: boolean;
  className?: string;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 100,
  loop = true,
  className = '',
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  // 当text改变时，重置状态
  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
    setIsTyping(true);
  }, [text]);

  useEffect(() => {
    if (!isTyping && !loop) return;

    const timer = setTimeout(() => {
      if (isTyping) {
        if (currentIndex < text.length) {
          setDisplayText((prev) => prev + text[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        } else {
          // 打字完成，等待一段时间后重置（如果开启循环）
          if (loop) {
            setTimeout(() => {
              setIsTyping(false);
              setDisplayText('');
              setCurrentIndex(0);
            }, 2000);
          } else {
            setIsTyping(false);
          }
        }
      } else {
        // 重置并开始新一轮打字
        setIsTyping(true);
      }
    }, isTyping && currentIndex < text.length ? speed : 2000);

    return () => clearTimeout(timer);
  }, [currentIndex, isTyping, text, speed, loop]);

  return (
    <span className={`typewriter ${className}`}>
      {displayText}
      <span className="typewriter-cursor">|</span>
    </span>
  );
};
