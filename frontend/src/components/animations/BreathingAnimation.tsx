import React from 'react';
import './BreathingAnimation.css';

interface BreathingAnimationProps {
  children: React.ReactNode;
  className?: string;
}

export const BreathingAnimation: React.FC<BreathingAnimationProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`breathing-animation ${className}`}>
      {children}
    </div>
  );
};
