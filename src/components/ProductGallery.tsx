import React, { useState, TouchEvent } from 'react';
import { ProductImage } from '../types';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

interface ProductGalleryProps {
  images: ProductImage[];
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const currentImage = images[currentIndex] || images[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Main Large Image Stage (Kree8-style floating rounded canvas) */}
      <div
        className="relative w-full aspect-square bg-white dark:bg-[#141A1E] border border-border-light dark:border-border-dark rounded-[24px] sm:rounded-[28px] overflow-hidden group shadow-clay dark:shadow-clay-dark transition-all duration-300"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
          loading="eager"
        />

        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center px-3.5 py-1 bg-white/95 dark:bg-[#1C252B]/95 backdrop-blur-md rounded-full text-[10px] font-medium tracking-[0.16em] uppercase text-ink-light dark:text-ink-dark border border-border-light dark:border-border-dark shadow-sm">
            {currentImage.label}
          </span>
        </div>

        {/* Zoom Lightbox Trigger */}
        <button
          onClick={() => setIsZoomModalOpen(true)}
          className="absolute top-4 right-4 z-10 p-2.5 bg-white/95 dark:bg-[#1C252B]/95 text-ink-light dark:text-ink-dark hover:text-teal dark:hover:text-teal transition-all rounded-full border border-border-light dark:border-border-dark shadow-sm hover:scale-105 opacity-80 group-hover:opacity-100"
          title="View high-resolution photograph"
          aria-label="Enlarge image"
        >
          <Maximize2 className="w-4 h-4 stroke-[1.5]" />
        </button>

        {/* Prev / Next arrows */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 pointer-events-none">
          <button
            onClick={handlePrev}
            className="pointer-events-auto p-2.5 bg-white/95 dark:bg-[#1C252B]/95 hover:bg-white text-ink-light dark:text-ink-dark transition-all rounded-full border border-border-light dark:border-border-dark shadow-sm -translate-x-1 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 sm:opacity-80 hover:scale-105"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
          </button>
          <button
            onClick={handleNext}
            className="pointer-events-auto p-2.5 bg-white/95 dark:bg-[#1C252B]/95 hover:bg-white text-ink-light dark:text-ink-dark transition-all rounded-full border border-border-light dark:border-border-dark shadow-sm translate-x-1 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 sm:opacity-80 hover:scale-105"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>

        {/* Mobile Swipe Pagination Dots */}
        <div className="absolute bottom-3 inset-x-0 flex items-center justify-center space-x-1.5 sm:hidden z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-5 bg-teal' : 'w-1.5 bg-ink-lightSubtle/40 dark:bg-ink-darkSubtle/40'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails Row */}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${images.length}, minmax(0, 1fr))` }}
      >
        {images.map((img, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={img.id}
              onClick={() => setCurrentIndex(idx)}
              className={`relative aspect-square overflow-hidden bg-white dark:bg-[#141A1E] border rounded-2xl transition-all duration-300 group cursor-pointer ${
                isActive
                  ? 'border-teal ring-2 ring-teal/30 scale-[1.02] shadow-sm'
                  : 'border-border-light dark:border-border-dark opacity-75 hover:opacity-100 hover:scale-[1.02]'
              }`}
              aria-label={`Select ${img.label}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-0 inset-x-0 text-[10px] text-center font-medium tracking-wider text-ink-light dark:text-ink-dark truncate bg-white/95 dark:bg-[#1C252B]/95 py-1 border-t border-border-light dark:border-border-dark">
                {img.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isZoomModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <button
            onClick={() => setIsZoomModalOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/90 dark:bg-[#1C252B] text-ink-light dark:text-ink-dark hover:scale-105 transition-transform z-50 border border-border-light dark:border-border-dark shadow-lg"
            aria-label="Close high-resolution viewer"
          >
            <X className="w-5 h-5 stroke-[1.8]" />
          </button>
          <div
            className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              className="max-h-[82vh] w-auto max-w-full object-contain shadow-2xl rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-[#141A1E]"
            />
            <p className="mt-4 font-sans text-xs uppercase tracking-widest text-white/90 text-center">
              {currentImage.alt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
