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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!loop && currentIndex >= text.length) return;

    const timer = setTimeout(() => {
      setCurrentIndex((previous) => previous < text.length ? previous + 1 : 0);
    }, currentIndex < text.length ? speed : 2000);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, loop, prefersReducedMotion]);

  return (
    <span className={`typewriter ${className}`}>
      {prefersReducedMotion ? text : text.slice(0, currentIndex)}
      {!prefersReducedMotion && <span className="typewriter-cursor">|</span>}
    </span>
  );
};
