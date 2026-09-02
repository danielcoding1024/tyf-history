import React, { useEffect, useState } from 'react';
import './Carousel.css';

export interface CarouselImage {
  src: string;
  alt: Record<'CN' | 'EN', string>;
  caption?: Record<'CN' | 'EN', string>;
  objectPosition?: string;
}

interface CarouselProps {
  images: CarouselImage[];
  language: 'CN' | 'EN';
  className?: string;
  autoPlay?: boolean;
  interval?: number;
}

export const Carousel: React.FC<CarouselProps> = ({
  images,
  language,
  className = '',
  autoPlay = true,
  interval = 3000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [failedIndexes, setFailedIndexes] = useState<Set<number>>(() => new Set());
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
    if (!autoPlay || isPaused || prefersReducedMotion || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, images.length, interval, isPaused, prefersReducedMotion]);

  const pauseAndSetIndex = (index: number) => {
    setIsPaused(true);
    setCurrentIndex(index);
  };

  const goToSlide = (index: number) => {
    pauseAndSetIndex(index);
  };

  const goToPrevious = () => {
    setIsPaused(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setIsPaused(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handleImageError = (index: number) => {
    setFailedIndexes((previous) => {
      const next = new Set(previous);
      next.add(index);
      return next;
    });
  };

  if (images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      className={`carousel ${className}`}
      role="region"
      aria-roledescription={language === 'CN' ? '图片轮播' : 'image carousel'}
      aria-label={currentImage.alt[language]}
    >
      <div className="carousel-container">
        {images.map((image, index) => (
          <div
            key={image.src}
            className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
            aria-hidden={index !== currentIndex}
          >
            {!failedIndexes.has(index) && (
              <img
                src={image.src}
                alt={image.alt[language]}
                style={{ objectPosition: image.objectPosition ?? 'center' }}
                onError={() => handleImageError(index)}
              />
            )}
            {image.caption && (
              <p className="carousel-caption">{image.caption[language]}</p>
            )}
          </div>
        ))}
      </div>

      <div className="carousel-count" aria-live="polite">
        {currentIndex + 1} / {images.length}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="carousel-button carousel-button-prev"
            onClick={goToPrevious}
            aria-label={language === 'CN' ? '上一张图片' : 'Previous image'}
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            className="carousel-button carousel-button-next"
            onClick={goToNext}
            aria-label={language === 'CN' ? '下一张图片' : 'Next image'}
          >
            <span aria-hidden="true">›</span>
          </button>

          <div className="carousel-dots">
            {images.map((_, index) => (
              <button
                type="button"
                key={index}
                className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={
                  language === 'CN'
                    ? `查看第 ${index + 1} 张图片`
                    : `View image ${index + 1}`
                }
                aria-current={index === currentIndex ? 'true' : undefined}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
